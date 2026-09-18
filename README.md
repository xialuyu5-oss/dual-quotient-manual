# 双商训练手册

[简体中文](README.md) · [繁體中文](README.zh-TW.md) · [English](README.en.md) · [日本語](README.ja.md)

**从聪明到智慧，从术器到道法。**

把思考、情绪与人际关系放进同一张训练地图：通过 **18 篇手册、24 题自测、每日与每周打卡**，把读到的道理变成可以反复练习的行动。

> **制作方式：本项目由 Cursor Vibe Coding 作成，使用模型 Fable5.1。**

[在线网页版](https://xialuyu5-oss.github.io/dual-quotient-manual/) · [界面预览](#界面预览) · [开始阅读](content/00-preface.md) · [一页纸总纲](content/17-one-page.md) · [功能介绍](#功能介绍) · [本地运行](#本地运行) · [源码结构](#源码结构)

> **可直接网页浏览：** [打开双商训练手册网页版](https://xialuyu5-oss.github.io/dual-quotient-manual/)，无需下载、安装或输入命令。

## Windows 免安装版

**[下载 v0.2.0 Windows 免安装包](https://github.com/xialuyu5-oss/dual-quotient-manual/releases/tag/v0.2.0)**

下载 `windows-x64.zip` → 完整解压 → 双击 **双商训练手册.exe**，浏览器会自动打开。无需安装 Node.js，也无需输入命令。使用期间保留启动窗口，关闭窗口即可退出。

- 面向 Windows 10/11 x64，使用系统 .NET Framework 4.x；请保留随包附带的 `app`、`runtime` 文件夹。
- 阅读、自测和打卡可离线使用，免安装版使用本机字体。
- 启动窗口跟随 Windows 界面语言；网页顶部可随时切换七种语言。
- 记录保存在当前浏览器，固定地址为 `http://127.0.0.1:43119/`。换浏览器、清除网站数据或使用隐私模式可能丢失记录；旧开发地址的记录不会自动迁移。
- 启动器未进行代码签名，Windows 可能显示未知发布者提示。
- 开发者可在 Windows x64、安装 Node.js 并执行 `npm ci` 后，运行 `npm run package:windows` 生成压缩包；产物位于 `dist/`。打包使用系统 .NET Framework C# 编译器，并获取对应 Node.js 版本的官方许可证。

## 界面预览

以下为本地实际运行的界面截图，日课中的完成状态为演示数据。

### 首页

![双商训练手册首页：从聪明到智慧，从术器到道法](docs/screenshots/home.jpg)

<details>
<summary>查看自测与日课界面</summary>

### 自测

![二十四题自测：按实际做法的频率选择答案](docs/screenshots/assessment.jpg)

### 日课

![日课打卡：每日练习、连续完成天数与近十四天记录](docs/screenshots/practice.jpg)

</details>

## 这是什么

「双商训练手册」是一本成长手册，也是一个配套的多语言阅读、自测与习惯打卡网站。它关注两个相互连接的问题：**如何看清事情，如何理解自己与他人。**

## 七种语言，全文可读

界面、18 篇正文、24 道题目、结果说明和日常练习均提供以下语言。使用页面顶部的语言选择器，切换后继续阅读同一章；同一浏览器、同一站点的已保存自测与打卡记录共用。

| 语言 | 直接网页浏览 | GitHub 正文 |
| --- | --- | --- |
| 简体中文 | [打开](https://xialuyu5-oss.github.io/dual-quotient-manual/zh-CN/) | [阅读](content/) |
| 繁體中文 | [開啟](https://xialuyu5-oss.github.io/dual-quotient-manual/zh-TW/) | [閱讀](content/zh-TW/) |
| English | [Open](https://xialuyu5-oss.github.io/dual-quotient-manual/en/) | [Read](content/en/) |
| 日本語 | [開く](https://xialuyu5-oss.github.io/dual-quotient-manual/ja/) | [読む](content/ja/) |
| Deutsch | [Öffnen](https://xialuyu5-oss.github.io/dual-quotient-manual/de/) | [Lesen](content/de/) |
| Русский | [Открыть](https://xialuyu5-oss.github.io/dual-quotient-manual/ru/) | [Читать](content/ru/) |
| Français | [Ouvrir](https://xialuyu5-oss.github.io/dual-quotient-manual/fr/) | [Lire](content/fr/) |

原有中文网址继续可用。GitHub 介绍页提供简体中文、繁体中文、English、日本語四版。译文为本项目整理，欢迎提出具体的译文修正。

手册用“道、法、术、器”组织两条训练路径。训练从具体工具与技法开始，逐步走向稳定的行为系统与判断力：

| 层次 | 智商之路：思考与判断 | 情商之路：情绪与关系 |
| --- | --- | --- |
| **器 · 工具** | 笔记、清单、决策日志、思维模型 | 情绪词汇、身体觉察、情绪日记、关系账本 |
| **术 · 技法** | 定义问题、逆向思考、概率判断、钢人练习 | 命名情绪、倾听复述、表达需要、反馈与修复 |
| **法 · 系统** | 固定复盘、分级决策、学习循环、个人原则 | 情绪节律、关系维护、冲突协议、日省 |
| **道 · 心性** | 承认未知、长期视角、承担后果 | 自知、理解他人、保持稳定 |

这里的“智商／情商”是手册组织思考与关系训练的框架。**自测用于自我反思，不是标准化 IQ／EQ 测验，也不提供能力提升的效果保证。**

## 功能介绍

### 阅读：按章节，也按自己的薄弱环节

- 每种语言 18 篇 Markdown 文章，覆盖概念地图、两条训练路径、日常练习、常见陷阱与参考书单。
- 首页提供八格矩阵和“见器、习术、立法、悟道”四个阶段的说明。
- 阅读页支持桌面侧栏目录、移动端抽屉目录、预计阅读时间和上一篇／下一篇导航。
- 暖纸色背景、衬线正文与分层色标，语言切换同步调整文字、日期和数字显示。
- 无需启动网站，也可以直接在 GitHub 阅读 [`content/`](content/) 中的全文。

### 自测：从实际做法找到练习入口

- 24 题，分 4 组；按“从不”到“总是”的 5 档频率作答。
- 每个“路径 × 层次”包含 3 题，结果展示八格分布、各路径的当前训练阶段和薄弱环节。
- 根据预设规则给出失衡模式提示，以及对应章节与练习建议。
- 本机最多保留最近 8 次结果，并在结果页展示与上次结果的变化。

<details>
<summary>自测如何计算</summary>

每格取对应 3 题的均值。阶段判断从“器”到“道”依次检查，以 3.5 为阈值，将第一个未达到阈值的层次作为当前训练阶段；全部达到时返回“悟道”。失衡模式由层次或路径之间的均值差触发。

这些阈值是项目中的启发式规则，源码未附标准化量表、常模或效度验证材料。详细规则见 [`src/lib/assessment.ts`](src/lib/assessment.ts)。

</details>

### 日课：让阅读进入日常

- **每日 5 项**：晨间三问、一次情绪命名、一条决策日志、读一段、晚间复盘。
- **每周 6 项**：日志回顾、关系维护、深度对话、逆向练习、技法回顾、下周重点。
- 展示连续完成天数、累计完成天数和近 14 天记录；当天 5 项全部完成才计为一个完成日。
- 每项练习链接到相关章节；支持确认后清除打卡记录。

建议从[序言](content/00-preface.md)与[自知](content/03-know-thyself.md)开始，再做一次自测、选择一个薄弱环节，每天练习一项。

## 全书目录

| 部分 | 章节 |
| --- | --- |
| 序 | [为什么聪明人常常不智慧](content/00-preface.md) |
| 第一部 · 地图 | [聪明与智慧的分野](content/01-cleverness-and-wisdom.md) · [道法术器：修炼的四层地图](content/02-dao-fa-shu-qi.md) · [自知：先给自己定位](content/03-know-thyself.md) |
| 第二部 · 智商之路 | [器：思考的工具箱](content/04-iq-qi.md) · [术：思维技法十二式](content/05-iq-shu.md) · [法：认知系统的搭建](content/06-iq-fa.md) · [道：从知识到判断](content/07-iq-dao.md) |
| 第三部 · 情商之路 | [器：情绪的工具箱](content/08-eq-qi.md) · [术：人际技法十二式](content/09-eq-shu.md) · [法：关系与心性的系统](content/10-eq-fa.md) · [道：仁、定、明](content/11-eq-dao.md) |
| 第四部 · 合一 | [双商合一：判断力的诞生](content/12-integration.md) · [从术器到道法的跃迁](content/13-transition.md) · [修炼计划](content/14-practice-plan.md) · [聪明人的十二个陷阱与解药](content/15-traps.md) |
| 附录 | [书单与出处](content/16-reading-list.md) · [一页纸总纲](content/17-one-page.md) |

## 本地运行

需要 **Node.js 20.9.0 或更高版本**及 npm。在项目目录执行：

```bash
npm ci
npm run dev
```

打开 [http://localhost:43117](http://localhost:43117)。无需配置数据库、登录账号或 AI API Key。

| 命令 | 用途 |
| --- | --- |
| `npm run dev` | 启动开发服务器，端口 `43117` |
| `npm run build` | 生产构建，预生成手册章节页面 |
| `npm run start` | 运行生产构建，端口 `43117`；需先执行 build |
| `npm run lint` | 运行 ESLint |
| `npm run test:i18n` | 检查七套文案、占位符、18 篇章节及稳定路径 |
| `npm run test:portable` | 检查本机静态服务器 |
| `npm run package:windows` | 构建并打包 Windows x64 免安装版 |

生产运行：

```bash
npm run build
npm run start
```

已配置 GitHub Pages 自动部署：[部署工作流](.github/workflows/deploy-pages.yml) 在 `main` 更新后检查所有语言并生成静态网站。网页不需要数据库或运行中的 Node.js 服务器。设置 `GITHUB_PAGES=1` 后运行 `npm run build` 可生成带项目路径前缀的 `out/`；`DQ_PORTABLE=1` 则生成免安装版使用的 `.next-portable/`。这两种导出无需运行 `npm run start`。

## 数据保存与联网说明

- 自测结果与打卡记录保存在当前浏览器、当前站点的 `localStorage` 中；当前源码没有账号、数据库、结果上传接口或应用分析埋点。
- 自测保留的是结果历史，未提交的答题进度不会持久保存。
- 不同设备、浏览器或站点地址之间不会同步；清除站点数据会丢失记录，当前没有导出备份功能。
- 页面会向 **Google Fonts** 请求 Noto Serif SC／Noto Sans SC 字体，失败时回落到系统字体。因此，本地保存记录并不代表页面完全没有外部网络请求。
- Cursor 与 Fable5.1 是项目的制作工具信息；应用中的评分与建议由本地规则生成，运行时不调用 AI 模型。

## 技术栈

| 层面 | 实现 |
| --- | --- |
| 应用框架 | Next.js 16.3.5 · App Router · React 19.2.8 · TypeScript |
| 样式与组件 | Tailwind CSS v4 · shadcn/ui · Base UI · Lucide |
| 内容加载 | 本地 Markdown 文件 · `gray-matter` 解析 frontmatter |
| 正文渲染 | `react-markdown` · `remark-gfm` · `remark-breaks` |
| 交互与保存 | React 客户端组件 · `localStorage` |

依赖的准确版本以 [`package-lock.json`](package-lock.json) 为准。

## 源码结构

```text
content/                          简体中文原文及六个译文子目录，每种 18 篇
src/
├── app/
│   ├── [[...route]]/             旧中文路径、七语言静态路由与页面元数据
│   └── globals.css               纸墨配色与阅读排版
├── views/                       首页、目录、章节、自测与日课页面
├── components/
│   ├── assessment/              作答、结果与历史对比
│   ├── practice/                日课、周课与完成统计
│   └── ui/                      通用界面组件
├── hooks/
│   ├── use-local-storage.ts     本地存储状态与订阅
│   └── use-now.ts               客户端时间
└── lib/
    ├── i18n/                    语言、路径、日期与七套界面词典
    ├── content.ts               章节读取、排序与相邻章节
    ├── taxonomy.ts              两条路径与四层地图的定义
    ├── assessment.ts            24 题、评分与推荐规则
    └── practice.ts              练习清单、日期与连续天数
```

正文在构建时读取并预渲染；自测计算、语言切换、打卡交互与记录保存发生在浏览器中。Windows 启动器与本机静态服务器位于 `packaging/`。

## 修改内容

在 [`content/`](content/) 中编辑或新增 `.md` 文件，使用以下 frontmatter：

```yaml
---
slug: my-chapter
label: 补充篇
title: 章节标题
subtitle: 章节副标题
part: integration
order: 18
summary: 一句话摘要
---
```

- `slug` 对应 `/manual/my-chapter`，应保持唯一；`order` 控制目录与上一篇／下一篇的顺序。
- `part` 可选 `preface`、`map`、`iq`、`eq`、`integration`、`appendix`。
- `iq`／`eq` 部分还需设置 `level`，可选 `qi`、`shu`、`fa`、`dao`；八格矩阵每格对应一个章节。
- 内容加载器含进程内缓存。修改内容后若页面未刷新，可重启开发服务器；生产环境需重新构建。
- 新增或修改章节时，同步更新六个语言子目录，保持 `slug`、`part`、`level`、`order` 一致。界面词典位于 `src/lib/i18n/dictionaries/`，命名占位符应保持一致。构建会先检查所有七种语言，缺失不会静默回退成中文。
- 题目与评分规则在 [`src/lib/assessment.ts`](src/lib/assessment.ts)，练习清单在 [`src/lib/practice.ts`](src/lib/practice.ts)。修改已引用章节的 `slug` 时，应同步更新相关链接与推荐映射。

## 制作说明

**本项目由 Cursor Vibe Coding 作成，使用模型 Fable5.1。**

项目将中文手册、交互式自测与日常训练结合，用于探索 AI 辅助开发如何把一个内容想法做成可阅读、可交互、可持续使用的网页应用。
