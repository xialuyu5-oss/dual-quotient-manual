# 双商トレーニング手冊

[简体中文](README.md) · [繁體中文](README.zh-TW.md) · [English](README.en.md) · [日本語](README.ja.md)

**賢さから知恵へ。道具と技術から、仕組みと根本の理解へ。**

思考、感情、人間関係を一つの地図で捉え、**18篇の手冊・24問のセルフチェック・毎日と毎週の実践**を通じて、学んだことを行動へつなげるアプリです。

> **本プロジェクトは Cursor Vibe Coding により作成されました。使用モデルは Fable5.1 です。**

> **ブラウザーですぐに利用できます：** [日本語版を開く](https://xialuyu5-oss.github.io/dual-quotient-manual/ja/)。ダウンロード、インストール、アカウント、API キーは不要です。

[序文を読む](content/ja/00-preface.md) · [一枚で見る全体図](content/ja/17-one-page.md) · [Windows 版](https://github.com/xialuyu5-oss/dual-quotient-manual/releases/tag/v0.3.0)

## 9言語で全文を読む

画面、18篇の本文、質問、結果の説明、実践項目を翻訳しています。上部の言語選択から、同じ章の別言語版へ移れます。同一ブラウザー・同一サイトの保存済み結果と実践記録は、言語をまたいで共用します。

| 言語 | Web 版 | GitHub の本文 |
| --- | --- | --- |
| 简体中文 | [開く](https://xialuyu5-oss.github.io/dual-quotient-manual/zh-CN/) | [読む](content/) |
| 繁體中文 | [開く](https://xialuyu5-oss.github.io/dual-quotient-manual/zh-TW/) | [読む](content/zh-TW/) |
| English | [開く](https://xialuyu5-oss.github.io/dual-quotient-manual/en/) | [読む](content/en/) |
| 日本語 | [開く](https://xialuyu5-oss.github.io/dual-quotient-manual/ja/) | [読む](content/ja/) |
| Deutsch | [開く](https://xialuyu5-oss.github.io/dual-quotient-manual/de/) | [読む](content/de/) |
| Русский | [開く](https://xialuyu5-oss.github.io/dual-quotient-manual/ru/) | [読む](content/ru/) |
| 한국어 | [開く](https://xialuyu5-oss.github.io/dual-quotient-manual/ko/) | [読む](content/ko/) |
| Español | [開く](https://xialuyu5-oss.github.io/dual-quotient-manual/es/) | [読む](content/es/) |
| Français | [開く](https://xialuyu5-oss.github.io/dual-quotient-manual/fr/) | [読む](content/fr/) |

従来の中国語 URL も引き続き利用できます。GitHub の紹介ページは簡体字中国語、繁体字中国語、英語、日本語の4版です。具体的な訳文の改善提案を歓迎します。

## Windows ポータブル版

[v0.3.0 Windows x64 版をダウンロード](https://github.com/xialuyu5-oss/dual-quotient-manual/releases/tag/v0.3.0)し、`windows-x64.zip` を**すべて展開**してから、**双商训练手册.exe** をダブルクリックします。既定のブラウザーで開きます。使用中は起動ウィンドウを残してください。閉じるとローカルサービスも終了します。

- Node.js の別途インストールやコマンド入力は不要です。本文、セルフチェック、実践はオフラインで使えます。
- Windows 10/11 x64、システムの .NET Framework 4.x を使用します。`app` と `runtime` フォルダーを一緒に保管してください。
- 起動ウィンドウは Windows の表示言語に従い、Web 画面では9言語を選択できます。
- アドレスは `http://127.0.0.1:43119/` のままです。同じブラウザーなら旧ポータブル版の記録を引き継げます。公開 Web 版や開発用アドレスの記録とは別です。
- 起動プログラムは未署名のため、Windows に発行元不明の表示が出る場合があります。

## 画面例

実際に動作させた画面です。実践の完了状態はデモ用データです。以下は従来の中国語画面を示しています。

![ホーム：四層のトレーニング地図](docs/screenshots/home.jpg)

<details>
<summary>セルフチェックと実践画面</summary>

![普段の行動の頻度から答える24問](docs/screenshots/assessment.jpg)

![毎日の実践、連続日数、最近の記録](docs/screenshots/practice.jpg)

</details>

## 何をするアプリか

中心となる問いは、**物事をどう明瞭に捉えるか、自分と他者をどう理解するか**です。道・法・術・器を使って、二つの道を整理します。

| 層 | 思考と判断 | 感情と関係 |
| --- | --- | --- |
| **器・道具** | ノート、チェックリスト、意思決定記録、思考モデル | 感情語彙、身体への気づき、日記、関係の帳簿 |
| **術・技術** | 問題設定、逆算、確率、反対意見の強化 | 名づけ、傾聴、ニーズの表現、フィードバック、修復 |
| **法・仕組み** | 定期的な振り返り、決定分類、学習循環、原則 | 感情のリズム、関係の維持、対立の約束、日々の点検 |
| **道・根本の理解** | 無知の自覚、長期の視点、結果への責任 | 自己理解、仁、心の安定 |

ここでの IQ／EQ は、思考と関係の練習を整理する枠組みです。**セルフチェックは自己省察用であり、標準化された知能検査や臨床評価ではありません。能力向上を保証するものでもありません。**

## 主な機能

**読む：** 各言語18篇の Markdown、八つのマス、四つの成長段階、読了時間の目安、前後の章への移動。デスクトップの目次サイドバーと、スマートフォンの目次ドロワーがあります。GitHub 上で本文だけ読むこともできます。

**確かめる：** 24問を4組に分け、行動頻度を5段階で答えます。道と層の各マスに3問を配置し、分布、現在の段階、偏り、推奨章を表示します。直近8回の結果をブラウザーに保存し、前回との違いも表示します。

**実践する：** 毎日5項目（朝の三問、感情の名づけ、意思決定記録、読書、夜の振り返り）と毎週6項目。連続完了日数、累計、直近14日を表示します。毎日の5項目がすべて終わった日を完了日とします。関連章へのリンクがあり、記録の消去には確認が入ります。

<details>
<summary>点数の計算方法</summary>

各マスは対応する3問の平均です。器から道へ順に3.5を基準として確認し、最初に基準を下回った層を現在の段階とします。全層が基準以上なら「道」です。層や道の平均差から、定義済みの偏りを表示します。

これはプロジェクト独自の目安です。標準化された尺度、母集団の基準、妥当性検証は添付されていません。詳細は [assessment.ts](src/lib/assessment.ts) を参照してください。

</details>

## 目次

| 部 | 章 |
| --- | --- |
| 序 | [賢い人が必ずしも賢明でない理由](content/ja/00-preface.md) |
| I・地図 | [賢さと知恵](content/ja/01-cleverness-and-wisdom.md) · [四層](content/ja/02-dao-fa-shu-qi.md) · [自分を知る](content/ja/03-know-thyself.md) |
| II・思考 | [器](content/ja/04-iq-qi.md) · [術](content/ja/05-iq-shu.md) · [法](content/ja/06-iq-fa.md) · [判断力](content/ja/07-iq-dao.md) |
| III・感情 | [器](content/ja/08-eq-qi.md) · [術](content/ja/09-eq-shu.md) · [法](content/ja/10-eq-fa.md) · [仁・定・明](content/ja/11-eq-dao.md) |
| IV・統合 | [二つの道の合流](content/ja/12-integration.md) · [移行](content/ja/13-transition.md) · [実践計画](content/ja/14-practice-plan.md) · [十二の落とし穴](content/ja/15-traps.md) |
| 付録 | [読書案内と出典](content/ja/16-reading-list.md) · [一枚で見る全体図](content/ja/17-one-page.md) |

## 開発・ビルド

**Node.js 20.9以上**と npm が必要です。

```bash
npm ci
npm run dev
```

[localhost:43117](http://localhost:43117) を開きます。データベース、ログイン、AI API キーは不要です。

| コマンド | 用途 |
| --- | --- |
| `npm run dev` | ポート43117で開発サーバーを起動 |
| `npm run build` | 全言語を検査してビルド |
| `npm run start` | 通常のサーバー用ビルドを起動 |
| `npm run lint` | ESLint |
| `npm run test:i18n` | 言語別のパス、文言、変数、章の対応を確認 |
| `npm run test:portable` | ローカル静的サーバーの検査 |
| `npm run package:windows` | `dist/` に Windows x64 ZIP を作成 |

通常の本番サーバーでは build の後に start を実行します。静的出力は `GITHUB_PAGES=1` で `out/`、`DQ_PORTABLE=1` で `.next-portable/` に生成します。静的版には start は不要です。

[Pages ワークフロー](.github/workflows/deploy-pages.yml) は `main` 更新時に全言語を検査し、公開 Web 版を配信します。Windows パッケージはシステムの C# コンパイラーを使い、Node.js と公式ライセンス、依存ライブラリーのライセンスを同梱します。

## データ保存と通信

- 結果と実践記録は、現在のブラウザー・サイトの `localStorage` に保存します。アカウント、データベース、結果送信 API、アプリ分析の仕組みはありません。
- 未提出の回答は永続保存しません。別端末・ブラウザー・アドレス間では同期せず、サイトデータを消すと記録も消えます。現在はバックアップ出力機能がありません。
- 公開 Web 版は Google Fonts にフォントを要求し、取得できなければシステムフォントを使います。ポータブル版はシステムフォントのみです。
- Cursor と Fable5.1 は制作方法の情報です。採点と提案はローカルのルールで行い、実行時に AI モデルへ接続しません。

## 構成と変更方法

Next.js 16.3.5、React 19.2.8、TypeScript、Tailwind CSS v4、shadcn/ui、Base UI、Lucide を使用。Markdown は `gray-matter`、`react-markdown`、`remark-gfm`、`remark-breaks` で扱います。正確な依存関係は [package-lock.json](package-lock.json) にあります。

```text
content/                  中国語原文と8言語の翻訳フォルダー
src/app/[[...route]]/     既存・多言語ルート、レイアウト、メタデータ
src/views/                ホーム、目次、本文、自己点検、実践
src/components/           共通 UI と操作機能
src/lib/i18n/             9言語の辞書、パス、日付・数値表示
src/lib/content.ts        章の読み込みと順序
src/lib/assessment.ts     質問、採点、推奨ルール
src/lib/practice.ts       実践項目、日付、連続日数
packaging/                起動プログラム、サーバー、検査、梱包
```

本文はビルド時に生成し、操作と保存はブラウザーで実行します。章を変更するときは9言語をそろえ、frontmatter の `label`、`title`、`subtitle`、`summary` を翻訳し、`slug`、`part`、`level`、`order` を共通に保ってください。画面の文言を追加したら辞書も更新し、名前付き変数を維持します。

読み込みにはプロセス内キャッシュがあります。開発中に変更が見えなければ再起動し、本番は再ビルドします。slug を変える場合は質問・実践側のリンクも更新してください。翻訳不足はビルドで検出し、中国語へ黙って置き換えません。

**Cursor Vibe Coding で作成。使用モデル：Fable5.1。**
