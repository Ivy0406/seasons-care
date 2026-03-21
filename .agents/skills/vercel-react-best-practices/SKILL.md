---
name: vercel-react-best-practices
description: React 19 與 Vite 專案的最佳實踐與效能優化指南。當撰寫、審查或重構 React 程式碼時，請務必遵循此技能的指示。觸發時機包含處理 React 元件、資料獲取、減少重複渲染或效能改善。
license: MIT
metadata:
  author: vercel (Adapted for Vite + React 19)
  version: "1.0.0"
---

# React 19 + Vite 專案最佳實踐與效能優化指南

這是一份專為本專案 (`Vite + React 19 + React Router 7`) 所制定的效能與開發最佳實踐指南。作為 AI Agent，請在生成程式碼或重構本專案時嚴格遵守以下規則，避免使用與本專案技術棧不符的 API（例如 Next.js 專用的 `next/dynamic` 或 Server Components）。

## 規則分類與優先級

| 優先範圍 | 分類 | 影響範圍 | 規則前綴 |
|--------|------|----------|--------|
| 1 | 消除 Waterfall (非同步最佳化) | **極高** | `async-` |
| 2 | 客戶端資料獲取 (Data Fetching)| **高** | `client-` |
| 3 | React 19 特性應用 | **高** | `react19-` |
| 4 | 打包體積最佳化 (Bundle Size) | **中** | `bundle-` |
| 5 | 減少重複渲染 (Re-render) | **中** | `rerender-` |
| 6 | 渲染與效能 (Rendering) | **中** | `rendering-` |

---

## 1. 消除 Waterfall (非同步最佳化)

- **`async-parallel`**: 使用 `Promise.all()` 處理獨立操作。
  如果兩個非同步請求彼此不依賴，不要依序 `await`（這會造成瀑布效應 Waterfall）。
  ```ts
  // 錯誤:
  const user = await fetchUser();
  const posts = await fetchPosts();
  // 正確:
  const [user, posts] = await Promise.all([fetchUser(), fetchPosts()]);
  ```
- **`async-defer-await`**: 將 `await` 推遲到真正需要的地方。只在確定必須等待的回傳值之前才執行 `await`，儘量提早啟動 Promise 執行。

---

## 2. 客戶端資料獲取 (Data Fetching)

- **`client-rr7-loader`**: 優先使用 React Router 7 的 Loader 與 Action。
  本專案使用 `react-router` v7，頁面與路由資料的獲取必須使用路由層級的 `loader` 函數，使用 `useLoaderData` 讀取資料；如果涉及表單覆寫、送出等操作，請使用路由層級的 `action` 函數，避免在元件生命週期 (`useEffect`) 進行初始載入。
  ```tsx
  // 正確寫法:
  export async function loader() { return fetchData(); }
  export default function Route() { const data = useLoaderData(); ... }
  ```
- **`client-event-listeners`**: 將全域監聽器或 `scroll` 等高頻率事件綁定改為 `passive`，並做好移除 (cleanup) 避免記憶體洩漏 (Memory leaks)。

---

## 3. React 19 特性應用

- **`react19-use-hook`**: 利用 `use()` 讀取 Promise 或 Context。
  在有 `Suspense` 邊界包裹的地方，可直接利用 `use(promise)` 解析非同步資料，或用 `use(Context)` 隨處存取 Context，不必綁定於 Hook 層級最上端。
- **`react19-actions`**: 會與資料互動的表單事件 (Mutations)，善加利用 `useActionState` 和 `useFormStatus` 來追蹤載入進度，而非自行手動維護大量 `isLoading`, `error` 的 `useState`。

---

## 4. 打包體積最佳化 (Bundle Size)

- **`bundle-lazy-suspense`**: 使用 `React.lazy` 載入重型元件。
  絕對不要使用 `next/dynamic`（因為此專案非 Next.js）。針對首頁不會立即出現在螢幕上的大型組件（圖表庫、彈出式對話框模組等），使用原生 `<Suspense>` + `React.lazy()` 進行程式碼分割 (Code Splitting)。
  ```tsx
  // 正確:
  import { lazy, Suspense } from 'react';
  const HeavyDialog = lazy(() => import('./HeavyDialog'));
  ```

---

## 5. 減少重複渲染 (Re-render)

- **`rerender-derived-state-no-effect`**: 刪除冗餘的衍生狀態 (Derived State)。
  不要使用 `useEffect` 去同步可以在渲染階段同步計算得出的狀態，避免不必要的額外渲染週期 (Re-render Cycle)。
  ```tsx
  // 錯誤:
  const [count, setCount] = useState(0);
  useEffect(() => { setCount(items.length); }, [items]);
  // 正確:
  const count = items.length; // 渲染時直接計算衍生狀態
  ```
- **`rerender-memo`**: 若無 React Compiler 介入，請適度使用 `useCallback` 與 `useMemo`。特別是在將函數或物件型 props 傳遞給由 `React.memo` 包裝的子元件時，以確保參照穩定，防止無謂重繪。
- **`rerender-functional-setstate`**: 使用函式型 SetState (`setCount(prev => prev + 1)` ) 有助於在 `useEffect` 或 `useCallback` 中減少依賴項目的數量，減少因依賴變化而導致的重新觸發。

---

## 6. 渲染與 JS 效能 (Rendering)

- **`rendering-conditional-render`**: 條件渲染，請優先使用三元運算子 `? :` 而非 `&&`。
  為避免左側條件評估為數值 `0` 時，React 在畫面上意外輸出字元 `"0"`：
  ```tsx
  // 錯誤:
  { count && <p>Count: {count}</p> }
  // 正確:
  { count > 0 ? <p>Count: {count}</p> : null }
  ```
- **`rendering-hoist-jsx`**: 將不需要隨狀態重新創建的靜態 JSX 或靜態資源物件拉升 (Hoist) 到元件外部，以節省記憶體並加快垃圾回收機制 (GC)。
