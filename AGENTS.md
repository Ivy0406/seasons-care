# Seasons Care 前端協作指引

## 角色定位
- 此專案為 Seasons Care 前端程式碼庫。
- 任務明確時，直接執行，不要過度規劃。
- 所有修改以小步、可 review、可回退為原則。

## 技術與工具
- 套件管理：`npm`
- 語言：`TypeScript`
- 程式碼格式與檢查：`Prettier`、`ESLint`
- 版本控制：`GitHub`
- 建議編輯器插件：
  - `Tailwind CSS IntelliSense`
  - `YAML by Red Hat`

## Git Flow 規範
- 禁止直接在 `main` 開發。
- 日常整合分支為 `dev`。
- 開發前先同步遠端 `dev`：
  - `git checkout dev`
  - `git pull origin dev`
- 所有工作分支都必須從 `dev` 切出。
- `qa` 僅供測試整合使用，不能反向帶回 `feature`、`dev` 或 `main`。

## 分支命名規則
- 一律使用英文小寫。
- 任務描述使用 kebab-case。
- 格式：`<type>/<task-name>`

可用分支類型：
- `feature/`：新增功能或新畫面
- `update/`：既有功能邏輯或 UI 調整
- `fix/`：Bug 修復
- `hotfix/`：從 `main` 切出的正式環境緊急修復
- `refactor/`：不改外部行為的重構
- `chore/`：文件、腳本、設定、依賴與格式整理

## Commit 規範
- 格式：`<type>: <message>`
- 訊息以英文為主。
- 第一行要短、明確、可讀。

可用 commit 類型：
- `feat`
- `update`
- `fix`
- `refactor`
- `chore`
- `style`

範例：
- `feat: add care-log list query hook`
- `update: adjust calendar header spacing`
- `fix: preserve selected date after creating diary`

## PR 規範
- PR 標題格式：`<Type>/<short-description>`
- 範例：`Feature/login-logic`
- PR 內容使用英文，並以無序列點簡述變更。
- 禁止自行審核自己的 PR。
- 必須由另一位前端成員 review 並 approve 後才能 merge。
- 發布到 `main` 的 PR 標題使用日期流水號格式：
  - 格式：`YYYYMMDD.NNN`
  - 範例：`20260226.001`

## 專案結構原則
- 採功能導向結構。
- 程式碼盡量放在最接近責任邊界的位置。
- 頁面負責組裝，不負責承擔過重商業邏輯。

### 目錄責任
- `src/api/`
  - API client 與 endpoint 定義
- `src/components/`
  - 全域共用 UI 元件
  - 不放 feature 專屬商業邏輯
- `src/features/`
  - 功能模組自己的元件、hooks、狀態、型別
- `src/hooks/`
  - 跨功能共用的 hooks
- `src/pages/`
  - 路由頁面，負責組裝 features
- `src/routes/`
  - 路由表、路由守衛、路徑常數
- `src/store/`
  - 全域狀態設定
- `src/types/`
  - 多模組共用型別與 API 對齊模型
- `src/utils/`
  - 無副作用工具函式
- `src/constants/`
  - 全域常數與環境設定

## 實作原則
- 先重用既有模式，再考慮新增抽象。
- feature 邏輯盡量留在 feature 內部。
- 只在跨模組共用時，才把型別放進 `src/types/`。
- 單一功能內部使用的型別優先放在 feature 內。
- 共用元件保持單純，避免綁死特定業務流程。

## 驗證要求
- 修改完成後，依變更內容執行必要檢查。
- 建議驗證順序：
  - `npm run lint`
  - `npm run typecheck`
  - `npm run build`

## 部署注意事項
- GitHub Actions 工作流放在 `.github/workflows/`。
- 涉及部署的修改要盡量獨立、可 review。
- 不得將 secrets 或真實環境變數直接提交進版本庫。
