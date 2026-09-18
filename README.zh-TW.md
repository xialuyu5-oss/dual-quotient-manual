# 雙商訓練手冊

[簡體中文](README.md) · [繁體中文](README.zh-TW.md) · [English](README.en.md) · [日本語](README.ja.md)

**從聰明到智慧，從術器到道法。**

把思考、情緒與人際關係放進同一張訓練地圖：通過 **18 篇手冊、24 題自測、每日與每週打卡**，把讀到的道理變成可以反覆練習的行動。

> **製作方式：本項目由 Cursor Vibe Coding 作成，使用模型 Fable5.1。**

[在線網頁版](https://xialuyu5-oss.github.io/dual-quotient-manual/zh-TW/) · [界面預覽](#界面預覽) · [開始閱讀](content/zh-TW/00-preface.md) · [一頁紙總綱](content/zh-TW/17-one-page.md) · [功能介紹](#功能介紹) · [本地運行](#本地運行) · [源碼結構](#源碼結構)

> **可直接網頁瀏覽：** [打開雙商訓練手冊網頁版](https://xialuyu5-oss.github.io/dual-quotient-manual/zh-TW/)，無需下載、安裝或輸入命令。

## Windows 免安裝版

**[下載 v0.3.0 Windows 免安裝包](https://github.com/xialuyu5-oss/dual-quotient-manual/releases/tag/v0.3.0)**

下載 `windows-x64.zip` → 完整解壓 → 雙擊 **雙商訓練手冊.exe**，瀏覽器會自動打開。無需安裝 Node.js，也無需輸入命令。使用期間保留啟動窗口，關閉窗口即可退出。

- 面向 Windows 10/11 x64，使用系統 .NET Framework 4.x；請保留隨包附帶的 `app`、`runtime` 文件夾。
- 閱讀、自測和打卡可離線使用，免安裝版使用本機字體。
- 啟動窗口跟隨 Windows 界面語言；網頁頂部可隨時切換九種語言。
- 記錄保存在當前瀏覽器，固定地址為 `http://127.0.0.1:43119/`。換瀏覽器、清除網站數據或使用隱私模式可能丟失記錄；舊開發地址的記錄不會自動遷移。
- 啟動器未進行代碼簽名，Windows 可能顯示未知發布者提示。
- 開發者可在 Windows x64、安裝 Node.js 并執行 `npm ci` 后，運行 `npm run package:windows` 生成壓縮包；產物位于 `dist/`。打包使用系統 .NET Framework C# 編譯器，并獲取對應 Node.js 版本的官方許可證。

## 界面預覽

以下為本地實際運行的界面截圖，日課中的完成狀態為演示數據。

### 首頁

![雙商訓練手冊首頁：從聰明到智慧，從術器到道法](docs/screenshots/home.jpg)

<details>
<summary>查看自測與日課界面</summary>

### 自測

![二十四題自測：按實際做法的頻率選擇答案](docs/screenshots/assessment.jpg)

### 日課

![日課打卡：每日練習、連續完成天數與近十四天記錄](docs/screenshots/practice.jpg)

</details>

## 這是什么

「雙商訓練手冊」是一本成長手冊，也是一個配套的多語言閱讀、自測與習慣打卡網站。它關注兩個相互連接的問題：**如何看清事情，如何理解自己與他人。**

## 九種語言，全文可讀

界面、18 篇正文、24 道題目、結果說明和日常練習均提供以下語言。使用頁面頂部的語言選擇器，切換后繼續閱讀同一章；同一瀏覽器、同一站點的已保存自測與打卡記錄共用。

| 語言 | 直接網頁瀏覽 | GitHub 正文 |
| --- | --- | --- |
| 簡體中文 | [打開](https://xialuyu5-oss.github.io/dual-quotient-manual/zh-CN/) | [閱讀](content/) |
| 繁體中文 | [開啟](https://xialuyu5-oss.github.io/dual-quotient-manual/zh-TW/) | [閱讀](content/zh-TW/) |
| English | [Open](https://xialuyu5-oss.github.io/dual-quotient-manual/en/) | [Read](content/en/) |
| 日本語 | [開く](https://xialuyu5-oss.github.io/dual-quotient-manual/ja/) | [読む](content/ja/) |
| 德語 · Deutsch | [Öffnen](https://xialuyu5-oss.github.io/dual-quotient-manual/de/) | [Lesen](content/de/) |
| 俄語 · Русский | [Открыть](https://xialuyu5-oss.github.io/dual-quotient-manual/ru/) | [Читать](content/ru/) |
| 韓國語 · 한국어 | [開啟](https://xialuyu5-oss.github.io/dual-quotient-manual/ko/) | [閱讀](content/ko/) |
| 西班牙語 · Español | [開啟](https://xialuyu5-oss.github.io/dual-quotient-manual/es/) | [閱讀](content/es/) |
| Français | [Ouvrir](https://xialuyu5-oss.github.io/dual-quotient-manual/fr/) | [Lire](content/fr/) |

原有中文網址繼續可用。GitHub 介紹頁提供簡體中文、繁體中文、English、日本語四版。譯文為本項目整理，歡迎提出具體的譯文修正。

手冊用“道、法、術、器”組織兩條訓練路徑。訓練從具體工具與技法開始，逐步走向穩定的行為系統與判斷力：

| 層次 | 智商之路：思考與判斷 | 情商之路：情緒與關係 |
| --- | --- | --- |
| **器 · 工具** | 筆記、清單、決策日志、思維模型 | 情緒詞匯、身體覺察、情緒日記、關係賬本 |
| **術 · 技法** | 定義問題、逆向思考、概率判斷、鋼人練習 | 命名情緒、傾聽復述、表達需要、反饋與修復 |
| **法 · 系統** | 固定復盤、分級決策、學習循環、個人原則 | 情緒節律、關係維護、沖突協議、日省 |
| **道 · 心性** | 承認未知、長期視角、承擔后果 | 自知、理解他人、保持穩定 |

這里的“智商／情商”是手冊組織思考與關係訓練的框架。**自測用于自我反思，不是標準化 IQ／EQ 測驗，也不提供能力提升的效果保證。**

## 功能介紹

### 閱讀：按章節，也按自己的薄弱環節

- 每種語言 18 篇 Markdown 文章，覆蓋概念地圖、兩條訓練路徑、日常練習、常見陷阱與參考書單。
- 首頁提供八格矩陣和“見器、習術、立法、悟道”四個階段的說明。
- 閱讀頁支持桌面側欄目錄、移動端抽屜目錄、預計閱讀時間和上一篇／下一篇導航。
- 暖紙色背景、襯線正文與分層色標，語言切換同步調整文字、日期和數字顯示。
- 無需啟動網站，也可以直接在 GitHub 閱讀 [`content/`](content/) 中的全文。

### 自測：從實際做法找到練習入口

- 24 題，分 4 組；按“從不”到“總是”的 5 檔頻率作答。
- 每個“路徑 × 層次”包含 3 題，結果展示八格分布、各路徑的當前訓練階段和薄弱環節。
- 根據預設規則給出失衡模式提示，以及對應章節與練習建議。
- 本機最多保留最近 8 次結果，并在結果頁展示與上次結果的變化。

<details>
<summary>自測如何計算</summary>

每格取對應 3 題的均值。階段判斷從“器”到“道”依次檢查，以 3.5 為閾值，將第一個未達到閾值的層次作為當前訓練階段；全部達到時返回“悟道”。失衡模式由層次或路徑之間的均值差觸發。

這些閾值是項目中的啟發式規則，源碼未附標準化量表、常模或效度驗證材料。詳細規則見 [`src/lib/assessment.ts`](src/lib/assessment.ts)。

</details>

### 日課：讓閱讀進入日常

- **每日 5 項**：晨間三問、一次情緒命名、一條決策日志、讀一段、晚間復盤。
- **每週 6 項**：日志回顧、關係維護、深度對話、逆向練習、技法回顧、下週重點。
- 展示連續完成天數、累計完成天數和近 14 天記錄；當天 5 項全部完成才計為一個完成日。
- 每項練習鏈接到相關章節；支持確認后清除打卡記錄。

建議從[序言](content/zh-TW/00-preface.md)與[自知](content/zh-TW/03-know-thyself.md)開始，再做一次自測、選擇一個薄弱環節，每天練習一項。

## 全書目錄

| 部分 | 章節 |
| --- | --- |
| 序 | [為什么聰明人常常不智慧](content/zh-TW/00-preface.md) |
| 第一部 · 地圖 | [聰明與智慧的分野](content/zh-TW/01-cleverness-and-wisdom.md) · [道法術器：修煉的四層地圖](content/zh-TW/02-dao-fa-shu-qi.md) · [自知：先給自己定位](content/zh-TW/03-know-thyself.md) |
| 第二部 · 智商之路 | [器：思考的工具箱](content/zh-TW/04-iq-qi.md) · [術：思維技法十二式](content/zh-TW/05-iq-shu.md) · [法：認知系統的搭建](content/zh-TW/06-iq-fa.md) · [道：從知識到判斷](content/zh-TW/07-iq-dao.md) |
| 第三部 · 情商之路 | [器：情緒的工具箱](content/zh-TW/08-eq-qi.md) · [術：人際技法十二式](content/zh-TW/09-eq-shu.md) · [法：關係與心性的系統](content/zh-TW/10-eq-fa.md) · [道：仁、定、明](content/zh-TW/11-eq-dao.md) |
| 第四部 · 合一 | [雙商合一：判斷力的誕生](content/zh-TW/12-integration.md) · [從術器到道法的躍遷](content/zh-TW/13-transition.md) · [修煉計劃](content/zh-TW/14-practice-plan.md) · [聰明人的十二個陷阱與解藥](content/zh-TW/15-traps.md) |
| 附錄 | [書單與出處](content/zh-TW/16-reading-list.md) · [一頁紙總綱](content/zh-TW/17-one-page.md) |

## 本地運行

需要 **Node.js 20.9.0 或更高版本**及 npm。在項目目錄執行：

```bash
npm ci
npm run dev
```

打開 [http://localhost:43117](http://localhost:43117)。無需配置數據庫、登錄賬號或 AI API Key。

| 命令 | 用途 |
| --- | --- |
| `npm run dev` | 啟動開發服務器，端口 `43117` |
| `npm run build` | 生產構建，預生成手冊章節頁面 |
| `npm run start` | 運行生產構建，端口 `43117`；需先執行 build |
| `npm run lint` | 運行 ESLint |
| `npm run test:i18n` | 檢查九套文案、占位符、18 篇章節及穩定路徑 |
| `npm run test:portable` | 檢查本機靜態服務器 |
| `npm run package:windows` | 構建并打包 Windows x64 免安裝版 |

生產運行：

```bash
npm run build
npm run start
```

已配置 GitHub Pages 自動部署：[部署工作流](.github/workflows/deploy-pages.yml) 在 `main` 更新后檢查所有語言并生成靜態網站。網頁不需要數據庫或運行中的 Node.js 服務器。設置 `GITHUB_PAGES=1` 后運行 `npm run build` 可生成帶項目路徑前綴的 `out/`；`DQ_PORTABLE=1` 則生成免安裝版使用的 `.next-portable/`。這兩種導出無需運行 `npm run start`。

## 數據保存與聯網說明

- 自測結果與打卡記錄保存在當前瀏覽器、當前站點的 `localStorage` 中；當前源碼沒有賬號、數據庫、結果上傳接口或應用分析埋點。
- 自測保留的是結果歷史，未提交的答題進度不會持久保存。
- 不同設備、瀏覽器或站點地址之間不會同步；清除站點數據會丟失記錄，當前沒有導出備份功能。
- 頁面會向 **Google Fonts** 請求 Noto Serif SC／Noto Sans SC 字體，失敗時回落到系統字體。因此，本地保存記錄并不代表頁面完全沒有外部網絡請求。
- Cursor 與 Fable5.1 是項目的製作工具信息；應用中的評分與建議由本地規則生成，運行時不調用 AI 模型。

## 技術棧

| 層面 | 實現 |
| --- | --- |
| 應用框架 | Next.js 16.3.5 · App Router · React 19.2.8 · TypeScript |
| 樣式與組件 | Tailwind CSS v4 · shadcn/ui · Base UI · Lucide |
| 內容加載 | 本地 Markdown 文件 · `gray-matter` 解析 frontmatter |
| 正文渲染 | `react-markdown` · `remark-gfm` · `remark-breaks` |
| 交互與保存 | React 客戶端組件 · `localStorage` |

依賴的準確版本以 [`package-lock.json`](package-lock.json) 為準。

## 源碼結構

```text
content/                          簡體中文原文及八個譯文子目錄，每種 18 篇
src/
├── app/
│   ├── [[...route]]/             舊中文路徑、九語言靜態路由與頁面元數據
│   └── globals.css               紙墨配色與閱讀排版
├── views/                       首頁、目錄、章節、自測與日課頁面
├── components/
│   ├── assessment/              作答、結果與歷史對比
│   ├── practice/                日課、週課與完成統計
│   └── ui/                      通用界面組件
├── hooks/
│   ├── use-local-storage.ts     本地存儲狀態與訂閱
│   └── use-now.ts               客戶端時間
└── lib/
    ├── i18n/                    語言、路徑、日期與九套界面詞典
    ├── content.ts               章節讀取、排序與相鄰章節
    ├── taxonomy.ts              兩條路徑與四層地圖的定義
    ├── assessment.ts            24 題、評分與推薦規則
    └── practice.ts              練習清單、日期與連續天數
```

正文在構建時讀取并預渲染；自測計算、語言切換、打卡交互與記錄保存發生在瀏覽器中。Windows 啟動器與本機靜態服務器位于 `packaging/`。

## 修改內容

在 [`content/`](content/) 中編輯或新增 `.md` 文件，使用以下 frontmatter：

```yaml
---
slug: my-chapter
label: 補充篇
title: 章節標題
subtitle: 章節副標題
part: integration
order: 18
summary: 一句話摘要
---
```

- `slug` 對應 `/manual/my-chapter`，應保持唯一；`order` 控制目錄與上一篇／下一篇的順序。
- `part` 可選 `preface`、`map`、`iq`、`eq`、`integration`、`appendix`。
- `iq`／`eq` 部分還需設置 `level`，可選 `qi`、`shu`、`fa`、`dao`；八格矩陣每格對應一個章節。
- 內容加載器含進程內緩存。修改內容后若頁面未刷新，可重啟開發服務器；生產環境需重新構建。
- 新增或修改章節時，同步更新八個語言子目錄，保持 `slug`、`part`、`level`、`order` 一致。界面詞典位于 `src/lib/i18n/dictionaries/`，命名占位符應保持一致。構建會先檢查所有九種語言，缺失不會靜默回退成中文。
- 題目與評分規則在 [`src/lib/assessment.ts`](src/lib/assessment.ts)，練習清單在 [`src/lib/practice.ts`](src/lib/practice.ts)。修改已引用章節的 `slug` 時，應同步更新相關鏈接與推薦映射。

## 製作說明

**本項目由 Cursor Vibe Coding 作成，使用模型 Fable5.1。**

項目將中文手冊、交互式自測與日常訓練結合，用于探索 AI 輔助開發如何把一個內容想法做成可閱讀、可交互、可持續使用的網頁應用。
