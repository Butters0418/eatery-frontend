type LiteralUnion<T extends U, U = string> = T | (U & Record<never, never>);

const ORDER_SOCKET_EVENT_TYPES = [
  'newOrder',
  'newItem',
  'orderUpdated',
  'deleteOrder',
  'deleteOrderItem',
  'itemServed',
  'orderPaid',
  'orderCompleted',
] as const;

export type BroadcastEventType = (typeof ORDER_SOCKET_EVENT_TYPES)[number];

const isBroadcastEvent = (value: string): value is BroadcastEventType =>
  ORDER_SOCKET_EVENT_TYPES.includes(value as BroadcastEventType);

export interface OrderSummaryPayload {
  orderId: string;
  orderCode: string;
  orderType: string;
  createdAt?: string;
  tableNumber?: number | null;
}

export interface BroadcastPayloadMap {
  newOrder: OrderSummaryPayload;
  newItem: OrderSummaryPayload;
  orderUpdated: OrderSummaryPayload & { updatedAt?: string };
  deleteOrder: OrderSummaryPayload & { reason?: string };
  deleteOrderItem: OrderSummaryPayload & { itemCode: string };
  itemServed: OrderSummaryPayload & { itemCode: string; isServed: boolean };
  orderPaid: OrderSummaryPayload & { isPaid: boolean };
  orderCompleted: OrderSummaryPayload;
}

type LifecycleEventType = 'connected' | 'disconnected' | 'error';

type OrderSocketEventType = BroadcastEventType | LifecycleEventType;

type LifecyclePayloadMap = {
  connected: undefined;
  disconnected: { code?: number; reason?: string };
  error: { error: Event };
};

type EventPayloadMap = BroadcastPayloadMap & LifecyclePayloadMap;

type EventHandler<T extends OrderSocketEventType> = (
  payload: EventPayloadMap[T],
) => void;

interface OrderSocketMessage {
  type: LiteralUnion<BroadcastEventType>;
  data?: Record<string, unknown>;
}

const resolveWsUrl = () => {
  if (import.meta.env.VITE_WS_URL) {
    return import.meta.env.VITE_WS_URL as string;
  }

  if (typeof window === 'undefined') {
    return 'ws://localhost:3080';
  }

  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  const hostname = window.location.hostname;
  const port = import.meta.env.VITE_WS_PORT || '3080';

  return `${protocol}://${hostname}:${port}`;
};

class OrderSocketClient {
  private socket: WebSocket | null = null;

  private readonly listeners = new Map<
    OrderSocketEventType,
    Set<EventHandler<OrderSocketEventType>>
  >();

  private reconnectTimer: number | null = null;

  private reconnectAttempts = 0;

  private authToken: string | null = null;

  private readonly wsUrl: string;

  private shouldReconnect = false;

  constructor() {
    this.wsUrl = resolveWsUrl();
  }

  connect(token: string) {
    this.authToken = token;
    this.shouldReconnect = true;

    if (
      this.socket &&
      (this.socket.readyState === WebSocket.OPEN ||
        this.socket.readyState === WebSocket.CONNECTING)
    ) {
      // 如果已連線，重新傳送認證即可
      this.authenticate();
      return;
    }

    this.initializeSocket();
  }

  disconnect() {
    this.shouldReconnect = false;
    this.clearReconnectTimer();

    if (!this.socket) return;

    this.socket.removeEventListener('open', this.handleOpen);
    this.socket.removeEventListener('message', this.handleMessage);
    this.socket.removeEventListener('close', this.handleClose);
    this.socket.removeEventListener('error', this.handleError);
    this.socket.close();
    this.socket = null;
  }

  subscribe<T extends OrderSocketEventType>(
    event: T,
    handler: EventHandler<T>,
  ) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    const handlers = this.listeners.get(event)!;
    const wrappedHandler = handler as EventHandler<OrderSocketEventType>;
    handlers.add(wrappedHandler);

    return () => {
      handlers.delete(wrappedHandler);
      if (handlers.size === 0) {
        this.listeners.delete(event);
      }
    };
  }

  private initializeSocket() {
    try {
      this.socket = new WebSocket(this.wsUrl);
    } catch (error) {
      console.error('❌ 無法建立 WebSocket 連線', error);
      this.scheduleReconnect();
      return;
    }

    this.socket.addEventListener('open', this.handleOpen);
    this.socket.addEventListener('message', this.handleMessage);
    this.socket.addEventListener('close', this.handleClose);
    this.socket.addEventListener('error', this.handleError);
  }

  private authenticate() {
    if (
      !this.socket ||
      this.socket.readyState !== WebSocket.OPEN ||
      !this.authToken
    ) {
      return;
    }

    this.socket.send(
      JSON.stringify({
        type: 'auth',
        token: this.authToken,
      }),
    );
  }

  private handleOpen = () => {
    this.reconnectAttempts = 0;
    this.authenticate();
    this.emit('connected', undefined);
  };

  private handleMessage = (event: MessageEvent<string>) => {
    try {
      const parsed: OrderSocketMessage = JSON.parse(event.data);

      if (isBroadcastEvent(parsed.type)) {
        const payload = (parsed.data ??
          {}) as unknown as BroadcastPayloadMap[typeof parsed.type];
        this.emit(parsed.type, payload);
      } else {
        console.warn('⚠️ 未支援的 WebSocket 訊息:', parsed.type);
      }
    } catch (error) {
      console.error('❌ 解析 WebSocket 訊息失敗', error);
    }
  };

  private handleClose = (event: CloseEvent) => {
    this.emit('disconnected', { code: event.code, reason: event.reason });
    this.cleanupSocket();
    this.scheduleReconnect();
  };

  private handleError = (event: Event) => {
    console.error('❌ WebSocket 發生錯誤', event);
    this.emit('error', { error: event });
  };

  private cleanupSocket() {
    if (!this.socket) return;

    this.socket.removeEventListener('open', this.handleOpen);
    this.socket.removeEventListener('message', this.handleMessage);
    this.socket.removeEventListener('close', this.handleClose);
    this.socket.removeEventListener('error', this.handleError);
    this.socket = null;
  }

  private scheduleReconnect() {
    if (!this.shouldReconnect || typeof window === 'undefined') {
      return;
    }

    this.clearReconnectTimer();
    const backoff = Math.min(30000, 1000 * 2 ** this.reconnectAttempts);
    this.reconnectAttempts += 1;

    this.reconnectTimer = window.setTimeout(() => {
      if (this.authToken) {
        this.initializeSocket();
      }
    }, backoff);
  }

  private clearReconnectTimer() {
    if (this.reconnectTimer !== null && typeof window !== 'undefined') {
      window.clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private emit<T extends OrderSocketEventType>(
    event: T,
    payload: EventPayloadMap[T],
  ) {
    const handlers = this.listeners.get(event);
    if (!handlers || handlers.size === 0) return;

    handlers.forEach((handler) => {
      handler(payload as never);
    });
  }
}

const orderSocketClient = new OrderSocketClient();

export { ORDER_SOCKET_EVENT_TYPES };

export default orderSocketClient;
