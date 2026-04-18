<p align="center">
  <img src="public/favicon.svg" width="80" />
</p>

<h1 align="center">Seasons Care 蒔歲</h1>


[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?logo=vite)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![React Router](https://img.shields.io/badge/React_Router-7.13-CA4245?logo=react-router)](https://reactrouter.com/)


這是一個以 React 19 與 TypeScript 開發的 SPA（單頁式應用程式）家庭共同照護工具。透過 TanStack Query 進行狀態管理，並串接 RESTful API 實現健康數據追蹤、照護日誌紀錄、群組共享與記帳功能。整合 AI 語音辨識，使用者只需口說即可自動填寫紀錄表單，大幅降低忙碌照護者輸入數據的門檻，讓紀錄變得直覺又快速。

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

*   **格式**：`類型/任務說明`（以烤肉串 kebab-case 命名為主）

| 分支類型 | 分支名稱 | 來自 | 合併至 | 說明 |
| :--- | :--- | :--- | :--- | :--- |
| **主分支** | `main` | - | - | 穩定版本，嚴禁直接 push。 |
| **開發分支** | `dev` | `main` | `main` | 開發基準線。 |
| **測試分支** | `qa` | `dev` | - | 模擬正式環境的測試分支。 |
| **新增分支** | `feature` | `dev` | `dev` | 新增功能或畫面。 |
| **更新分支** | `update` | `dev` | `dev` | 現有功能的邏輯或 UI 變更。 |
| **修復分支** | `fix` | `dev` | `dev` | 開發中發現的 Bug 修復。 |
| **緊急修復** | `hotfix` | `main` | `main` & `dev` | 線上環境緊急修復。 |
| **重構分支** | `refactor` | `dev` | `dev` | 代碼優化，不改變外部行為。 |
| **雜事分支** | `chore` | `dev` | `dev` | 專案文件、yml 腳本、依賴包、格式調整。 |

💬 **Commit 訊息規範**

*   **格式**：`類型: 訊息描述`（中間加空格，訊息以英文為主）
*   **範例**：`fix: read care-log participant id from currentUser`

| 類型 | 說明 |
| :--- | :--- |
| **feat** | 新增 UI 或功能。 |
| **update** | 既有功能或 UI 調整。 |
| **fix** | 修補 Bug。 |
| **refactor** | 重構（非功能、非 Bug）。 |
| **chore** | 雜項、環境設定。（如：README、skills 文件） |
| **style** | 僅影響程式碼排版，不涉及邏輯。 |
