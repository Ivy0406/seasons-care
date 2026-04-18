<h1 align="center">
  <img src="public/favicon.svg" width="32" /> 
  Seasons Care 蒔歲
</h1>

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?logo=vite)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![React Router](https://img.shields.io/badge/React_Router-7.13-CA4245?logo=react-router)](https://reactrouter.com/)


這是一個以 React 19 與 TypeScript 開發的 SPA（單頁式應用程式）全方位健康與生活照護平台。透過 TanStack Query 進行狀態管理，並串接 RESTful API 實現健康數據追蹤、照護日誌紀錄、群組共享與記帳功能。整合 AI 語音辨識，使用者只需口說即可自動填寫紀錄表單，大幅降低長輩或忙碌照護者輸入數據的門檻，讓紀錄變得直覺又快速。

---

## 👀 專案預覽 
*(預覽圖片待補充)*
![首頁](/public/icons/LOGO.svg)

---

## 🛠 使用技術 

*   **核心框架**：React 19.2 (TypeScript 5.9)
*   **建構工具**：Vite 7.3
*   **樣式處理**：Tailwind CSS 4.2 
*   **狀態管理**：TanStack Query v5
*   **路由管理**：React Router 7.13
*   **表單驗證**：React Hook Form
*   **數據視覺化**：Recharts
*   **HTTP 請求**：Axios 1.13
*   **身分驗證**：js-cookie (JWT 流程)
*   **UI 元件庫**：Shadcn UI, Lucide Icons, Sonner (Toast)

---

## 📂 專案架構 

```text
seasons-care/
├─ .github/workflows/     # GitHub Actions 自動部署與 PR 通知
├─ api/ai/                # AI 解析相關 API (Edge Functions)
├─ public/                # 靜態資源 (SVG 圖標、Favicon)
├─ src/
│  ├─ api/                # API 實例與各模組 Endpoints 管理
│  ├─ assets/             # 樣式定義 (Colors, Typography) 與圖標
│  ├─ components/         # 元件庫
│  │  ├─ common/          # 共用元件 (Modal, Drawer, Calendar)
│  │  └─ ui/              # 基礎 UI 元件 (Shadcn)
│  ├─ features/           # 業務邏輯模組
│  │  ├─ auth/            # 身份驗證
│  │  ├─ health/          # 健康數據
│  │  ├─ careLog/         # 照護任務
│  │  ├─ groups/          # 照護群組管理
│  │  └─ money/           # 記帳功能
│  ├─ hooks/              # 全域自定義 Hooks 
│  ├─ pages/              # 頁面層級組件
│  ├─ routes/             # 路由配置
│  ├─ types/              # 全域型別定義
│  ├─ utils/              # 通用工具函式 
│  ├─ App.tsx             # 應用程式入口
│  └─ main.tsx            # React 渲染入口
├─ .env.example           # 環境變數範本
└─ package.json           # 專案依賴與腳本
```

## 🚀 啟動專案 
請確認電腦已安裝 Node.js v20.19.0 以上。

1. **安裝依賴**
```bash
npm install
```

2. **啟動開發伺服器**
```bash
npm run dev
```

---

## 🤝 協作規範
🌱 **分支命名規範**

類別  | 用途                        | 範例 
---------------|-----------------------------------|----------------------------
feature/       | 新增功能                           | feature/[branch-name]
update/        | 更新、優化（UI & UX、改文案）         | update/[branch-name]
fix/           | 修復 Bug                           | fix/[branch-name]
hotfix/        | 修復重大 Bug                        | hotfix/[branch-name]
chore/         | 初始化專案或環境建置 (npm 安裝)       | chore/[branch-name]

💬 **Commit 訊息規範**
* 用「 類別 : 做的事」
* 「：」後面要空格後，再打要做的事。

類別  | 用途 
---------------|------------------------------------------------------------
feat           | 新增功能 
update         | 修改既有項目或功能（UI / UX 微調、既有功能的行為優化）
fix            | 修復 Bug 
style          | 格式、風格（不影響程式碼運行的變動，如空白鍵、分號等）
perf           | 改善效能 
chore          | 建構程序或輔助工具的變動（如：npm 安裝、文件更新）
refactor       | 重構（既不是修復 Bug 也不是新增功能的程式碼變動）
