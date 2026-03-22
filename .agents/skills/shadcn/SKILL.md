---
name: shadcn
description: 管理 shadcn 元件與專案 — 包括新增、搜尋、修正、除錯、樣式設定以及 UI 組合。提供專案脈絡、元件文件與使用範例。適用於修改 shadcn/ui、元件註冊檔、預設設定、--preset 或任何包含 components.json 的專案。同時也會在執行「shadcn init」、「套用 --preset 建立 app」或「切換至 --preset」時觸發。
user-invocable: false
allowed-tools: Bash(npx shadcn@latest *), Bash(pnpm dlx shadcn@latest *), Bash(bunx --bun shadcn@latest *)
---

# shadcn/ui

用於建立 UI 元件和設計系統的框架。所有元件都會透過 CLI 以原始碼的形式加入到使用者的專案中。

> **重要提示：** 執行所有 CLI 指令時，請依據專案的 `packageManager` 使用對應的套件執行器：`npx shadcn@latest`、`pnpm dlx shadcn@latest` 或 `bunx --bun shadcn@latest`。下方的範例均以 `npx shadcn@latest` 示範，請自行替換為適用此專案的指令。

## 目前專案脈絡 (Current Project Context)

```json
!`npx shadcn@latest info --json`
```

上方 JSON 包含了該專案的設定檔以及已安裝的元件屬性。你可以使用 `npx shadcn@latest docs <元件名稱>` 取得任何元件的說明文件和範例網址。

## 基本原則 (Principles)

1. **優先使用現有元件**：在撰寫自訂 UI 之前，請先使用 `npx shadcn@latest search` 查詢官方或社群元件。
2. **組合而非重新發明**：設定頁面 = Tabs + Card + 表單控制欄位。儀表板 = Sidebar + Card + Chart + Table。
3. **優選內建變數樣式 (variants)**：例如 `variant="outline"`, `size="sm"` 等，非必要不要手寫樣式。
4. **使用語意化色彩**：如 `bg-primary`, `text-muted-foreground` — 絕對不要寫出類似 `bg-blue-500` 的原始顏色。

## 關鍵規則 (Critical Rules)

這些規則是**強制執行**的。每一項都附有連結，指向包含「錯誤/正確」程式碼的詳細規則文件。請 Agent 在需要設計這些部分時務必讀取對應英文說明檔。

### 樣式與 Tailwind (Styling & Tailwind) → [styling.md](./rules/styling.md)

- **`className` 只用於排版，不可用於覆蓋樣式**。請勿覆寫元件內建的顏色或排版預設值。
- **禁用 `space-x-*` 或 `space-y-*`**。請改用 `flex` 搭配 `gap-*`。對於垂直堆疊請用 `flex flex-col gap-*`。
- **長寬相等時使用 `size-*`**。例如 `size-10`，不要寫 `w-10 h-10`。
- **使用 `truncate` 縮寫**。不要手動寫 `overflow-hidden text-ellipsis whitespace-nowrap`。
- **禁用手刻 `dark:` 色彩覆蓋**。使用語意化 Token（如 `bg-background`, `text-muted-foreground`）。
- **使用 `cn()` 處理條件類別**。不要寫出複雜的手動 Template literal 三元運算子。
- **禁用手刻 `z-index` 於覆蓋層元件**。Dialog, Sheet, Popover 等會自己處理層疊順序。

### 表單與輸入 (Forms & Inputs) → [forms.md](./rules/forms.md)

- **表單必須使用 `FieldGroup` + `Field`**。永遠不要用 `div` 搭配 `space-y-*` 或 `grid gap-*` 進行表單佈局。
- **`InputGroup` 需搭配 `InputGroupInput`/`InputGroupTextarea`**。千萬不可直接將原始的 `Input`/`Textarea` 放進 `InputGroup` 裡。
- **輸入框內的按鈕需使用 `InputGroup` + `InputGroupAddon`**。
- **選項集（2-7個）使用 `ToggleGroup`**。不要用迴圈搭配 `Button` 自行建立手動啟動狀態。
- **相關 Checkbox/Radio 群組使用 `FieldSet` + `FieldLegend`**。不要用一個帶標題的 `div`。
- **欄位驗證使用 `data-invalid` + `aria-invalid`**。在 `Field` 加上 `data-invalid`，並在控制元件加上 `aria-invalid`。禁用則為：`data-disabled` 與 `disabled`。

### 元件結構 (Component Structure) → [composition.md](./rules/composition.md)

- **子項目永遠要在其群組內**：`SelectItem` → `SelectGroup`。`DropdownMenuItem` → `DropdownMenuGroup`。`CommandItem` → `CommandGroup`。
- **使用 `asChild` (radix) 或 `render` (base)** 來客製觸發器。請參考 JSON 給的 `base` 欄位決定。→ [base-vs-radix.md](./rules/base-vs-radix.md)
- **Dialog, Sheet 和 Drawer 都必須要有 Title**：基於無障礙要求。若希望不可見請使用 `className="sr-only"`。
- **使用完整的 Card 組合**：`CardHeader`/`CardTitle`/`CardDescription`/`CardContent`/`CardFooter`。不要把所有東西丟進 `CardContent` 裡。
- **Button 沒有 `isPending`/`isLoading` 屬性**：請用 `Spinner` + `data-icon` + `disabled` 組合。
- **`TabsTrigger` 必須位於 `TabsList` 之內**。不要直接在 `Tabs` 下渲染 triggers。
- **`Avatar` 永遠都需要 `AvatarFallback`**：供圖片載入失敗時顯示。

### 使用元件而非客製標籤 (Use Components, Not Custom Markup) → [composition.md](./rules/composition.md)

- **優先尋找元件，而非手寫 div**。例如自訂的 UI 排版。
- **醒目提示請用 `Alert`**。
- **空白狀態請用 `Empty`**。
- **通知吐司請透過 `sonner`** 的 `toast()` 呼叫。
- **請使用 `Separator`** 取代 `<hr>` 或 `<div className="border-t">`。
- **載入佔位符號請用 `Skeleton`**。沒有自訂的 `animate-pulse` div 這回事。
- **請使用 `Badge`** 取代自帶樣式的 custom span。

### 圖示 (Icons) → [icons.md](./rules/icons.md)

- **Button 內的圖示使用 `data-icon` 定位**：於 icon 上施加 `data-icon="inline-start"` 或 `data-icon="inline-end"`。
- **元件內的圖示不得加上 sizing 類別**：元件透過 CSS 自己掌握 Icon 大小。不可寫 `size-4` 或 `w-4 h-4`。
- **以物件傳遞圖示，而非字串鍵值**：如 `icon={CheckIcon}`，絕非使用字串查找。

### CLI 工具指令

- **絕對不要自行解析或讀取 preset 編碼**：一律直接傳遞給 `npx shadcn@latest init --preset <code>` 處理。

## 關鍵模式 (Key Patterns)

以下是不易察覺但十分關鍵的最佳寫法範例（進階細節請見上述規則文件）。

```tsx
// ✅ 原則一：表單佈局是 FieldGroup + Field，不是 div + Label。
<FieldGroup>
  <Field>
    <FieldLabel htmlFor="email">Email</FieldLabel>
    <Input id="email" />
  </Field>
</FieldGroup>

// ✅ 原則二：驗證時：Field 吃 data-invalid，輸入框吃 aria-invalid。
<Field data-invalid>
  <FieldLabel>Email</FieldLabel>
  <Input aria-invalid />
  <FieldDescription>無效的 email。</FieldDescription>
</Field>

// ✅ 原則三：按鈕裡面的圖示綁定 data-icon，不要手寫 size 樣式。
<Button>
  <SearchIcon data-icon="inline-start" />
  搜尋
</Button>

// ✅ 原則四：間距請使用 gap-*，禁用 space-y-*。
<div className="flex flex-col gap-4">

// ✅ 原則五：方正維度使用 size-*，不寫 w-* h-*。
<Avatar className="size-10">

// ✅ 原則六：狀態色彩請用 Badge 變數或語意化標籤，禁用自訂顏色。
<Badge variant="secondary">+20.1%</Badge>    // 正確
<span className="text-emerald-600">+20.1%</span> // 錯誤
```

## 元件選擇指引 (Component Selection)

根據你要做什麼，選用對應的元件：
- **按鈕/動作**：`Button` （搭配合適的 variant）
- **表單輸入**：`Input`, `Select`, `Combobox`, `Switch`, `Checkbox`, `RadioGroup`, `Textarea`, `InputOTP`, `Slider`
- **2–5 個選項的切換**：`ToggleGroup` + `ToggleGroupItem`
- **資料顯示**：`Table`, `Card`, `Badge`, `Avatar`
- **導航菜單**：`Sidebar`, `NavigationMenu`, `Breadcrumb`, `Tabs`, `Pagination`
- **疊加與懸浮視窗**：`Dialog` (模態對話窗), `Sheet` (側拉視窗), `Drawer` (底部抽屜), `AlertDialog` (用以確認的對話窗)
- **回饋與載入**：`sonner` (快顯), `Alert`, `Progress`, `Skeleton`, `Spinner`
- **指令面板**：封裝在 `Dialog` 內的 `Command`
- **圖表**：`Chart` (包裝 Recharts)
- **排版佈局**：`Card`, `Separator`, `Resizable`, `ScrollArea`, `Accordion`, `Collapsible`
- **空白狀態**：`Empty`
- **下拉與選單**：`DropdownMenu`, `ContextMenu`, `Menubar`
- **工具提示/資訊**：`Tooltip`, `HoverCard`, `Popover`

## 重要欄位 (Key Fields)

從 `npx shadcn@latest info --json` 取得的專案配置包含極重要的欄位，請嚴格遵守：
- **`aliases`** → 依據指引使用對應的別名前綴 (例如 `@/`, `~/`)，千萬不可寫死。
- **`isRSC`** → 若為 `true`，只要元件使用了 `useState`, `useEffect`、原生事件或 Browser API，檔案最上方就必須加入 `"use client"`。（針對此 Vite 專案不影響，但 Agent 仍需判斷此欄位）。
- **`tailwindVersion`** → `"v4"` 使用 `@theme inline` 區塊；`"v3"` 則修改 `tailwind.config.js`。
- **`tailwindCssFile`** → 專案配置全域 CSS 變數的檔案路徑，你必須去修改這個指定檔案，不要擅自加上其他的新檔案。
- **`style`** → 元件視覺風格 (e.g. `nova`, `vega`)。
- **`base`** → 底層函式庫 (`radix` 或 `base`)，影響元件 API 與支援的 props 操作。
- **`iconLibrary`** → 指定圖示來源：若是 `lucide` 使用 `lucide-react`，若是 `tabler` 使用 `@tabler/icons-react` 等等。不要擅自預測使用者用的是 lucide。
- **`resolvedPaths`** → 從檔案系統找出確切的 component, utils 等目錄路徑。
- **`framework`** → 路由與框架（例如 Next.js App Router 或 Vite SPA）。
- **`packageManager`** → 如果要另外安裝某些第三方套件，請聽命於這裡的指令 (例如 `pnpm add date-fns` 還是 `npm install date-fns`)。

完整的參數列表請參考 [cli.md — `info` command](./cli.md)。

## 元件說明文件、範例與使用 (Component Docs)

執行 `npx shadcn@latest docs <元件名稱>` 來獲取元件的文件、範例網址以及 API 原理，請主動獲取這些網址來得到解答。

```bash
npx shadcn@latest docs button dialog select
```

**每當創建、修復、除錯某個元件時，Agent 都必須優先運行一次 `npx shadcn@latest docs` 去取得網址並查閱**。這能保證你在正確的使用情境下編寫程式碼，而不是瞎猜。

## 工作執行流程 (Workflow)

1. **取得專案脈絡** — 在本文頂部應已載入。若要更新可再次執行 `npx shadcn@latest info`。
2. **先檢查是否為已安裝元件** — 執行 `add` 前，一定要先檢查 `components` 名單，或是利用 `resolvedPaths.ui` 目錄來檢查。絕對不要嘗試 imports 沒有加入的組件，且不要重複 `add` 已安裝了的。
3. **搜尋組件** — `npx shadcn@latest search`。
4. **取得規範與範例** — 運行 `npx shadcn@latest docs <元件>` 拿取網址並前往查閱。要預覽還沒安裝的元件細節可使用 `npx shadcn@latest view`。若欲比較更動差異可使用 `npx shadcn@latest add --diff`。
5. **安裝或更新** — `npx shadcn@latest add`。若元件已安裝，欲進行更新請使用 `--dry-run` 與 `--diff` 以預覽差異（詳看下段說明）。
6. **修正來自第三方依賴的原生 Imports** — 從非官方 Registry（如 `@bundui`, `@magicui`）下載的資源，常常寫死像 `@/components/ui/` 等不存在的路徑。在安裝後務必使用 `npx shadcn@latest info` 抓出的 `ui` 別名並主動修改那些寫死的路徑。
7. **嚴格審視安裝後的組件** — 任何 Registry 上的元件或 block 安裝完成後，**都必須主動替使用者打開那些檔案並進行徹底審查與錯誤消除**。是否少載入特定組件？是否違反上述的 [關鍵規則](#關鍵規則-critical-rules)？是否導入了錯誤的 `iconLibrary`（如使用了預設的 lucide-react 卻與本專案不符）？務必於接續後端操作前徹底檢查。
8. **Registry 必須明確** — 如果使用者要求生成什麼組件，但沒有要求特定 Registry（例如沒有加上 `@shadcn` 或是 `@tailark`），你必須要問他要安裝在哪，不要自己幫使用者做決定。
9. **當需要切換 preset 時** — 首先詢問使用者：**reinstall(重裝)**, **merge(合併)**, 還 **skip(略過)**?
   - **Reinstall**: `npx shadcn@latest init --preset <code> --force --reinstall` 會覆蓋一切元件。
   - **Merge**: `npx shadcn@latest init --preset <code> --force --no-reinstall`，接著跑 `npx shadcn@latest info` 列出來已安裝元件，最後針對它們一一跑 `--dry-run` 與 `--diff` 從中取得並智能合併修改部份。
   - **Skip**: `npx shadcn@latest init --preset <code> --force --no-reinstall`。只影響 config 以及 CSS，完全不影響內部元件。
   - **注意**: 任何 preset 命令都得在根目錄執行。CLI 會自動處理 radix 或 base 之差異。若需要比較可手動加 `--base <current-base>`。

## 更新元件 (Updating Components)

當使用者請求依據上游更新而想要保留本地修改的時候，利用 `--dry-run` 與 `--diff` 智能合併。**絕不手動從 GitHub抓原始檔案 — 永遠都用 CLI**。

1. 執行 `npx shadcn@latest add <component> --dry-run` 檢視影響到的全數檔案。
2. 分別對各別檔案跑 `npx shadcn@latest add <component> --diff <file>` 查看與上游的原始差異。
3. 分析差異後來決定：
   - 如果無本地改動 → 安心直接覆寫。
   - 包含本地客製 → 請打開本地檔了解意圖並且合併上游的新邏輯，而非破壞原本的東西。
   - 若使用者明確指出「直接暴力更新」 → 這個時候就可以加 `--overwrite`，但你得事先取得他同意。
4. **絕不允許你在未獲使用者同意下使用 `--overwrite`。**

## 常用捷徑指令 (Quick Reference)

```bash
# 開新專案
npx shadcn@latest init --name my-app --preset base-nova
npx shadcn@latest init --name my-app --preset a2r6bw --template vite

# 開 Monorepo
npx shadcn@latest init --name my-app --preset base-nova --monorepo

# 初始化於剛抓下的既有專案內
npx shadcn@latest init --preset base-nova
npx shadcn@latest init --defaults  # 捷徑：--template=next --preset=base-nova

# 加入 Component
npx shadcn@latest add button card dialog
npx shadcn@latest add @magicui/shimmer-button
npx shadcn@latest add --all

# 預覽安裝改變 (先讀檔與查看差異避免翻車)
npx shadcn@latest add button --dry-run
npx shadcn@latest add button --diff button.tsx
npx shadcn@latest add @acme/form --view button.tsx

# 搜尋各大 Registry
npx shadcn@latest search @shadcn -q "sidebar"
npx shadcn@latest search @tailark -q "stats"

# 抓取 Component 文件與範例實作頁網址
npx shadcn@latest docs button dialog select

# 在 Registry 檢視還未安裝的詳細資料
npx shadcn@latest view @shadcn/button
```

**知名 Presets 名稱：** `base-nova`, `radix-nova`
**Templates 樣板支援：** `next`, `vite`, `start`, `react-router`, `astro` (支援 `--monorepo`) 與 `laravel` (無 monorepo)
**Preset Codes 代碼：** 開頭為 `a` (例如 `a2r6bw`) 的 Base62 雜湊碼。

## 詳細參考資料文件 (Detailed References)

若代理程式 (Agent) 面臨複雜的元件運用，請務必查閱以下英文原件，皆為不可取代的設計模式實踐：
- [rules/forms.md](./rules/forms.md) — 探討 FieldGroup, Field, 輸入群組, 切換群組與驗證技巧
- [rules/composition.md](./rules/composition.md) — 視窗覆蓋群組、Card、Tabs、大頭貼及 Skeleton 組合法則
- [rules/icons.md](./rules/icons.md) — data-icon、圖示屬性傳遞與 sizing 制約
- [rules/styling.md](./rules/styling.md) — 語意色彩、長寬配置、z-index、RWD 斷點與主題實例
- [rules/base-vs-radix.md](./rules/base-vs-radix.md) — `asChild` 與 `render` 基本元件取捨
- [cli.md](./cli.md) — 完整的 CLI 強制參數應用詳解
- [customization.md](./customization.md) — 主題擴充與變數衍生客製指引
