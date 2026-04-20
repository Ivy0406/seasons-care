---
name: commit-msg
description: 分析 git diff 並產生符合本專案規範的 commit message。適用於「幫我寫 commit」、「產生 commit message」、「這次改了什麼」等請求。
---

# Commit Message 產生器

## 目標
- 根據目前 git 變更內容，整理出可讀的變更摘要。
- 產生符合本專案規範的 commit message。
- 規範以本 repo 的協作方式為準，不使用 scope，不使用中文 commit 主句。

## 執行步驟

1. **讀取變更**
   - 先執行 `git diff --cached --stat` 與 `git diff --cached`
   - 若沒有 staged 變更，再執行 `git diff --stat` 與 `git diff`

2. **判斷主要意圖**
   - 根據變更內容判斷這次修改的核心目的
   - 若橫跨多個檔案，以主要功能或主要風險為主，不要把多個意圖硬塞進同一個描述

3. **選擇 commit 類型**
   - 只能使用以下類型：
     - `feat`
     - `update`
     - `fix`
     - `refactor`
     - `chore`
     - `style`

4. **產生 commit message**
   - 格式固定為：

```text
type: english message
```

## 類型使用規則

| 類型 | 使用時機 |
| --- | --- |
| `feat` | 新增功能或新畫面 |
| `update` | 既有功能邏輯、資料流或 UI 調整 |
| `fix` | 修正 bug 或錯誤行為 |
| `refactor` | 重構程式碼但不改變預期功能 |
| `chore` | 文件、設定、依賴、腳本、技能檔等雜項修改 |
| `style` | 純排版、格式、命名、樣式微調，無邏輯變更 |

## 訊息規則
- commit message 使用英文
- 簡潔描述「這次改動的主要目的」
- 不要加入句號
- 盡量控制在一行內
- 優先使用動詞開頭

## 產生原則
- 不要照檔名逐一翻譯成訊息
- 不要把實作細節塞進 commit 主句
- 如果有明確使用者意圖，優先反映意圖而不是技術細節
- 若變更包含多個不同意圖，提供 2 到 3 個候選訊息

## 輸出格式

先輸出變更摘要，再輸出建議 commit message：

### 變更摘要
- 列出主要修改檔案
- 每點一句話說明主要改動

### 建議 Commit Message

```text
type: english message
```

若變更意圖不只一個，改為：

### 建議 Commit Message
```text
1. type: english message
2. type: english message
```

## 範例

### 範例一：修正建立日誌時日期遺失

```text
fix: preserve selected date across care-log creation
```

### 範例二：調整首頁導覽列與選單互動

```text
update: refine homepage navigation and side menu flow
```

### 範例三：新增技能檔或開發規範文件

```text
chore: add commit message skill guide
```
