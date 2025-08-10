# Eatery 前端 - 認證系統重構與優化計畫

本文件旨在改善現有的認證流程，解決狀態持久化問題，並提升程式碼的可維護性與結構。

---

## 階段一：狀態持久化與應用程式初始化

**目標：** 解決使用者重整頁面後登出狀態丟失的問題，並建立一個穩固的應用程式啟動流程。

- [ ] **任務 1.1: 安裝 Zustand Persist Middleware**
  - **操作：** 在你的專案中執行 `npm install zustand/middleware`。

- [ ] **任務 1.2: 修改 `useAuthStore` 以實現持久化**
  - **提示：** 這是最關鍵的一步，解決重整後狀態丟失的問題。
  - **操作：**
    1.  在 `src/stores/useAuthStore.ts` 中，從 `zustand/middleware` 引入 `persist`。
    2.  將你的 store 定義用 `persist(...)` 包裹起來。
    3.  設定 `name: 'auth-storage'`，這將是 `localStorage` 中的 key。
    4.  可以選擇性地使用 `partialize` 選項，只儲存 `token`, `account`, `role`, `isAuthenticated` 等必要狀態，避免儲存 `isLoading` 或錯誤訊息。

- [ ] **任務 1.3: 建立應用程式啟動邏輯**
  - **提示：** 這個步驟確保在使用者開啟應用程式時，如果本地有舊的 token，我們會先驗證它是否仍然有效。
  - **操作：**
    1.  在 `App.tsx` 或 `main.tsx` 的最上層組件中，使用 `useEffect` 훅。
    2.  在這個 `useEffect` 中，檢查 `useAuthStore` 的 `token` 是否存在。
    3.  如果存在，呼叫後端的 `GET /api/me` 端點來驗證 token 的有效性。
    4.  在驗證期間，將 `useAuthStore` 的 `isCheckingAuth` 設為 `true`，此時可以顯示一個全域的載入指示器 (例如 `LinearProgress`)。
    5.  如果 `GET /api/me` 成功，則更新 store 中的使用者資訊；如果失敗 (例如 token 過期)，則清除 store 中的認證狀態 (執行登出邏輯)。
    6.  最後，將 `isCheckingAuth` 設為 `false`。

---

## 階段二：API 請求邏輯抽象化

**目標：** 將 API 請求從 UI 元件中分離，並統一管理認證 Token 的附加。

- [ ] **任務 2.1: 建立統一的 API 客戶端 (API Client)**
  - **提示：** 這將使所有 API 請求集中管理，方便未來維護。
  - **操作：**
    1.  建立新檔案 `src/apis/apiClient.ts`。
    2.  在此檔案中，使用 `axios.create()` 建立一個 `axios` 實例。
    3.  設定 `baseURL` 為 `import.meta.env.VITE_API_URL`。

- [ ] **任務 2.2: 設定請求攔截器 (Request Interceptor)**
  - **提示：** 這是自動為每個需要認證的請求加上 JWT Token 的核心。
  - **操作：**
    1.  在 `apiClient.ts` 中，使用 `apiClient.interceptors.request.use()`。
    2.  在攔截器回呼函式中，從 `useAuthStore.getState()` 取得 `token`。
    3.  如果 `token` 存在，則在請求的 `headers` 中設定 `Authorization: Bearer ${token}`。
    4.  回傳被修改後的請求設定。

- [ ] **任務 2.3: (可選) 設定回應攔截器 (Response Interceptor)**
  - **提示：** 用於統一處理 API 錯誤，例如 token 過期時自動登出。
  - **操作：**
    1.  在 `apiClient.ts` 中，使用 `apiClient.interceptors.response.use()`。
    2.  在錯誤處理函式中，檢查 `error.response.status`。
    3.  如果狀態碼是 `401` (Unauthorized)，表示 token 可能已過期或無效。此時可以呼叫 `useAuthStore.getState().logout()` 來自動清除使用者狀態並導向到登入頁。

---

## 階段三：重構認證相關頁面

**目標：** 將現有頁面的 API 呼叫邏輯，改為使用新建立的 API 層。

- [ ] **任務 3.1: 建立 `authApi.ts`**
  - **提示：** 將所有認證相關的 API 呼叫封裝成函式。
  - **操作：**
    1.  建立新檔案 `src/apis/authApi.ts`。
    2.  從 `apiClient.ts` 引入 `apiClient`。
    3.  建立函式，例如：
        - `login(data)`: 內部呼叫 `apiClient.post('/api/login', data)`。
        - `forgotPassword(data)`: 內部呼叫 `apiClient.post('/api/resend-verification-code', data)`。
        - `verifyCode(data)`: 內部呼叫 `apiClient.post('/api/verify-reset-code', data)`。
        - `resetPassword(data)`: 內部呼叫 `apiClient.post('/api/reset-password', data)`。
    4.  在這些函式中處理 `try...catch` 邏輯，並回傳一個統一格式的物件，例如 `{ success: boolean, data?: any, error?: string }`。

- [ ] **任務 3.2: 重構 `LoginPage.tsx`**
  - **操作：**
    1.  從 `src/apis/authApi.ts` 引入 `login` 函式。
    2.  在 `onSubmit` 函式中，將原本的 `axios.post` 替換為呼叫 `await login(data)`。
    3.  根據 `login` 函式回傳的結果來更新 UI (設定 store 或顯示錯誤訊息)，而不是在元件內判斷 `statusCode`。

- [ ] **任務 3.3: 重構 `ForgotPassword.tsx`, `VerifyCode.tsx`, `ResetPassword.tsx`**
  - **操作：**
    - 仿照 `LoginPage.tsx` 的重構方式，將這些頁面中的 `axios` 呼叫，全部替換為從 `authApi.ts` 引入的對應函式。

---

完成以上所有任務後，你的認證系統將會更加強大、穩定且易於維護。
