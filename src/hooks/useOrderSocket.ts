import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import orderSocketClient, {
  BroadcastEventType,
  BroadcastPayloadMap,
  ORDER_SOCKET_EVENT_TYPES,
} from '../services/socketClient';
import useAuthStore from '../stores/useAuthStore';

const REFRESH_MATRIX: Record<
  BroadcastEventType,
  { orders?: boolean; tables?: boolean }
> = {
  newOrder: { orders: true, tables: true },
  newItem: { orders: true },
  orderUpdated: { orders: true },
  deleteOrder: { orders: true, tables: true },
  deleteOrderItem: { orders: true },
  itemServed: { orders: true },
  orderPaid: { orders: true },
  orderCompleted: { orders: true, tables: true },
};

const useOrderSocketConnection = () => {
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.role);
  const queryClient = useQueryClient();

  useEffect(() => {
    const isStaff = role === 'staff' || role === 'admin';

    if (!token || !isStaff) {
      orderSocketClient.disconnect();
      return undefined;
    }

    orderSocketClient.connect(token);

    const unsubscribes = ORDER_SOCKET_EVENT_TYPES.map((eventType) =>
      orderSocketClient.subscribe(eventType, () => {
        const config = REFRESH_MATRIX[eventType];
        if (config?.orders) {
          queryClient.invalidateQueries({ queryKey: ['allOrders'] });
        }
        if (config?.tables) {
          queryClient.invalidateQueries({ queryKey: ['allTables'] });
        }
      }),
    );

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
      orderSocketClient.disconnect();
    };
  }, [token, role, queryClient]);
};

export const useOrderSocketSubscription = (
  events: readonly BroadcastEventType[],
  handler: (
    eventType: BroadcastEventType,
    payload: BroadcastPayloadMap[BroadcastEventType],
  ) => void,
) => {
  useEffect(() => {
    if (!events.length) return undefined;

    const unsubscribes = events.map((eventType) =>
      orderSocketClient.subscribe(eventType, (payload) =>
        handler(eventType, payload),
      ),
    );

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, [events, handler]);
};

export default useOrderSocketConnection;
