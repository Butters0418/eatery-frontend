# spec

# 餐飲點餐系統 API 說明文件

## 📋 專案概述

這是一個完整的餐飲點餐系統後端 API，支援內用與外帶點餐、即時通知、訂單管理等功能。系統分為三種角色：**顧客**、**店員(Staff)**、**管理員(Admin)**，每個角色具有不同的權限與功能。

## 🏗 技術架構

- **後端框架**: Node.js + Express + TypeScript
- **資料庫**: MongoDB + Mongoose
- **即時通訊**: WebSocket
- **檔案上傳**: Firebase Storage
- **認證機制**: JWT Token
- **資料驗證**: Joi
- **密碼加密**: bcryptjs

## 🔐 認證機制

### Token 類型

- **JWT Token**: 用於 Admin/Staff 身份驗證
- **Table Token**: 用於顧客內用點餐驗證

### 權限層級

1. **無認證**: 顧客瀏覽商品、使用 Table Token 點餐
2. **Staff**: 店員操作訂單、管理出餐狀態
3. **Admin**: 管理員擁有所有權限，可管理商品、使用者、桌位

## 👥 使用者角色與功能

### 🛍 顧客 (Customer)

### 核心流程

1. **掃描 QR Code** → 取得桌號 Token
2. **瀏覽商品** → 查看菜單與商品詳情
3. **加入購物車** → 選擇商品與加料
4. **確認點餐** → 送出訂單
5. **追蹤訂單** → 查看出餐狀態

### 主要功能

- ✅ 掃描桌號 QR Code 取得 Table Token
- ✅ 瀏覽所有上架商品（無需登入）
- ✅ 查看商品詳細資訊與加料選項
- ✅ 內用點餐（需 Table Token 驗證）
- ✅ 加點功能（同桌追加餐點）
- ✅ 查看目前桌號的訂單狀態

---

### 👨‍💼 店員 (Staff)

### 核心流程

1. **登入系統** → 使用帳號密碼登入
2. **接收訂單** → 即時收到新訂單通知
3. **管理出餐** → 標記餐點出餐狀態
4. **處理結帳** → 標記訂單結帳狀態
5. **重置桌位** → 完成訂單後重置桌位

### 主要功能

- ✅ 帳號登入/登出
- ✅ 查看所有進行中訂單
- ✅ 新增外帶訂單
- ✅ 編輯未出餐的訂單項目
- ✅ 刪除未出餐的訂單項目
- ✅ 標記餐點出餐狀態
- ✅ 處理訂單結帳
- ✅ 完成訂單並重置桌位
- ✅ 即時接收 WebSocket 通知

---

### 👑 管理員 (Admin)

### 核心流程

1. **系統登入** → 使用管理員帳號登入
2. **商品管理** → 新增/編輯/刪除商品
3. **員工管理** → 新增/編輯店員帳號
4. **桌位管理** → 管理桌位資訊
5. **訂單管理** → 查看所有訂單記錄
6. **密碼重置** → 忘記密碼功能

### 主要功能

- ✅ 管理員登入/密碼重置
- ✅ 商品管理 (CRUD + 上架狀態)
- ✅ 店員帳號管理 (新增/編輯/刪除/解鎖)
- ✅ 桌位管理 (新增/編輯/刪除/重置)
- ✅ 圖片上傳功能
- ✅ 查看所有訂單 (含已軟刪除)
- ✅ 完整訂單操作權限
- ✅ 收發 WebSocket 通知

## 📡 API 端點總覽

### 🔐 認證相關 (User)

```
POST   /api/login                    # 使用者登入
POST   /api/verify-reset-code        # 驗證重設密碼驗證碼
POST   /api/resend-verification-code # 重發驗證碼

# Staff/Admin 專用
GET    /api/me                       # 取得目前使用者資訊

# Admin 專用
GET    /api/users                    # 取得所有使用者
POST   /api/users                    # 新增店員帳號
PATCH  /api/users/:id/unlock         # 解鎖員工帳號
PATCH  /api/users/:id                # 更新店員資訊
DELETE /api/users/:id                # 刪除店員帳號
POST   /api/reset-password           # 重設密碼

```

### 🍔 商品管理 (Product)

```
GET    /api/products                 # 取得商品列表
GET    /api/products/:id             # 取得單一商品詳情

# Admin 專用
POST   /api/products                 # 新增商品
PATCH  /api/products/:id             # 更新商品
DELETE /api/products/:id             # 刪除商品
PATCH  /api/products/:id/popular     # 更新熱門狀態
PATCH  /api/products/:id/available   # 更新上架狀態

```

### 🏪 桌位管理 (Table)

```
GET    /api/table/qr-token          # 取得桌號 Token (顧客用)

# Staff/Admin 專用
GET    /api/tables                   # 取得所有桌位狀態
GET    /api/tables/:id               # 取得單一桌位次資訊

# Admin 專用
POST   /api/tables                   # 新增桌位
PATCH  /api/tables/:id               # 更新桌位
DELETE /api/tables/:id               # 刪除桌位

```

### 📋 訂單管理 (Order)

```
GET    /api/orders                   # 取得訂單列表 (支援多種篩選)
POST   /api/orders                   # 建立訂單 (內用/外帶)

# Staff/Admin 專用
GET    /api/orders/:id                              # 取得單一訂單詳情
PATCH  /api/orders/:id/item/:itemCode               # 編輯訂單項目
PATCH  /api/orders/:id/item/:itemCode/delete        # 刪除訂單項目
PATCH  /api/orders/:id/item/:itemCode/served        # 標記出餐狀態
PATCH  /api/orders/:id/paid                         # 標記結帳狀態
PATCH  /api/orders/:id/complete                     # 完成訂單
PATCH  /api/orders/:id/delete                       # 軟刪除訂單

```

### 📤 檔案上傳 (Upload)

```
# Admin 專用
POST   /api/upload/image             # 圖片上傳

```

## 📊 資料結構

### 使用者 (User)

```tsx
interface IUser {
  account: string; // 帳號 (email 格式 for admin)
  password: string; // 加密密碼
  role: "admin" | "staff"; // 角色
  isLocked: boolean; // 是否鎖定
  loginFailCount: number; // 登入失敗次數
  verificationCode?: string; // 驗證碼 (admin 限定)
  verificationExpires?: Date; // 驗證碼過期時間
  createdAt: Date;
  updatedAt: Date;
}

```

### 商品 (Product)

```tsx
interface IProduct {
  name: string; // 商品名稱
  description?: string; // 商品描述
  price: number; // 價格
  category: string; // 分類
  imageUrl?: string; // 商品圖片
  isAvailable: boolean; // 是否上架
  isPopular: boolean; // 是否為熱門商品
  addons: AddonGroup[] | null; // 加料群組
  createdAt: Date;
  updatedAt: Date;
}

interface AddonGroup {
  group: string; // 群組名稱
  options: AddonOption[]; // 選項列表
}

interface AddonOption {
  name: string; // 選項名稱
  price: number; // 加價金額
}

```

### 桌位 (Table)

```tsx
interface ITable {
  tableNumber: number; // 桌號
  status: TableStatus; // 狀態 (空閒/使用中)
  currentOrder?: ObjectId | null; // 目前訂單 ID
  qrImage: string; // QR Code 圖片
  tableToken: string; // 桌號驗證 Token
  updated_at: Date;
}

enum TableStatus {
  Available = "空閒",
  InUse = "使用中",
}

```

### 訂單 (Order)

```tsx
interface IOrder {
  orderType: "內用" | "外帶"; // 訂單類型
  orderCode: string; // 訂單編號
  tableId?: ObjectId; // 桌位 ID (內用限定)
  orderList: OrderListItem[]; // 訂單項目列表
  totalPrice: number; // 總金額
  isAllServed: boolean; // 是否全部出餐
  isPaid: boolean; // 是否已結帳
  isComplete: boolean; // 是否已完成
  isDeleted?: boolean; // 是否已刪除 (軟刪除)
  createdAt: Date;
  updatedAt: Date;
}

interface OrderListItem {
  itemCode: string; // 項目編號
  item: OrderItem[]; // 商品列表
  isServed: boolean; // 是否已出餐
  createdBy?: ObjectId; // 建立者 (staff/admin)
}

interface OrderItem {
  productId: ObjectId; // 商品 ID
  name: string; // 商品名稱
  price: number; // 商品價格
  qty: number; // 數量
  addons: Addon[] | null; // 選擇的加料
  compositeId?: string; // 複合 ID (前端用)
}

```

## 🌐 WebSocket 即時通知

### 連線方式

```jsx
// 建立 WebSocket 連線
const ws = new WebSocket("ws://localhost:3000");

// 身份驗證 (Staff/Admin)
ws.send(
  JSON.stringify({
    type: "auth",
    token: "your-jwt-token",
  })
);

```

### 通知類型

```tsx
// 新訂單通知
{
  type: "newOrder",
  data: {
    orderId: string,
    orderType: "內用" | "外帶",
    orderCode: string,
    createdAt: Date
  }
}

// 加點通知
{
  type: "newItem",
  data: {
    orderId: string,
    orderCode: string,
    // ...
  }
}

// 訂單狀態更新
{
  type: "orderUpdated" | "itemServed" | "orderPaid" | "orderCompleted",
  data: {
    orderId: string,
    orderCode: string,
    // ...
  }
}

// 刪除通知
{
  type: "deleteOrder" | "deleteOrderItem",
  data: {
    orderId: string,
    orderCode: string,
    itemCode?: string
  }
}

```

## 🔄 業務流程圖

### 內用點餐流程

```
顧客掃描 QR Code
    ↓
取得 Table Token
    ↓
瀏覽商品並加入購物車
    ↓
確認點餐 (附帶 Table Token)
    ↓
系統驗證 Token 並建立訂單
    ↓
WebSocket 通知所有 Staff
    ↓
Staff 標記每次出餐狀態
    ↓
全部出餐後可結帳
    ↓
結帳完成後訂單完成
    ↓
桌位重置為空閒狀態

```

### 外帶點餐流程

```
Staff 登入系統
    ↓
選擇商品建立外帶訂單
    ↓
WebSocket 通知其他 Staff
    ↓
製作完成後標記出餐
    ↓
外帶訂單可直接結帳
    ↓
完成訂單

```

### 加點流程

```
同桌顧客再次點餐
    ↓
系統檢查桌位是否有進行中訂單
    ↓
有訂單且未結帳 → 執行加點
    ↓
更新原訂單項目清單
    ↓
WebSocket 通知 Staff 有新加點

```

## ⚠️ 重要注意事項

### 權限控制

- 顧客只能操作自己桌號的訂單
- Staff 可操作所有訂單但不能管理商品
- Admin 擁有完整權限

### 狀態限制

- 已出餐的餐點不能 **編輯** 或 **刪除**
- 已結帳的訂單不能 **刪除**
- 內用訂單需全部 **出餐** 才能 **結帳**
- 外帶訂單可隨時結帳

### 安全機制

- JWT Token 7 天有效期
- 密碼錯誤 3 次鎖定帳號
- Admin 忘記密碼有驗證碼機制
- Table Token 桌子清空後動態產生

### 檔案上傳

- 支援 JPG, PNG 格式
- 檔案大小限制 2MB
- 使用 Firebase Storage 存儲

## 🚀 快速開始

### 環境變數設定

```bash
# .env
MONGO_URI=mongodb://localhost:27017/eatery
JWT_SECRET=your-secret-key
FIREBASE_STORAGE_BUCKET=your-bucket-name
GMAIL_USER=your-gmail@gmail.com
GMAIL_PASS=your-app-password
PORT=3000

```

### 啟動專案

```bash
# 安裝依賴
npm install

# 建立 Admin 帳號
npm run create-admin

# 開發模式
npm run dev

# 生產模式
npm run build
npm start

```

### Tailwind config

```jsx
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#FF9B54",
          DEFAULT: "#FF7629",
          dark: "#E35A00",
        },
        secondary: {
          light: "#F0F9FF",
          DEFAULT: "#38B2AC",
          dark: "#2C7A7B",
        },
        grey: {
          light: "#F7F7F7",
          DEFAULT: "#6B7280",
          dark: "#374151",
        },
        error: {
          light: "#FF7A70",
          DEFAULT: "#FF4B3E",
          dark: "#CC392F",
        },
      },
      boxShadow: {
        custom: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
    },
  },
  plugins: [],
};

```

### 預設管理員帳號

```
帳號: butters.test.demo@gmail.com
密碼: @test1111

```

這份文件涵蓋了整個餐飲點餐系統的完整功能說明，可以讓設計師和前端開發者清楚了解需要製作的 UI 介面和交互流