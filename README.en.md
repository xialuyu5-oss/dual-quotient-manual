# Dual Quotient Training Manual

[简体中文](README.md) · [繁體中文](README.zh-TW.md) · [English](README.en.md) · [日本語](README.ja.md)

**From cleverness to wisdom; from tools and techniques to systems and understanding.**

An interactive handbook connecting clear thinking, emotional awareness and relationships through **18 chapters, a 24-question self-assessment and daily/weekly practice**.

> **Created with Cursor Vibe Coding, using the Fable5.1 model.**

> **Read and use it directly in your browser:** [Open the English web app](https://xialuyu5-oss.github.io/dual-quotient-manual/en/). No download, installation, account or API key required.

[Read the preface](content/en/00-preface.md) · [One-page overview](content/en/17-one-page.md) · [Windows download](https://github.com/xialuyu5-oss/dual-quotient-manual/releases/tag/v0.2.0)

## Seven complete app languages

The interface, all chapters, questions, result explanations and practice instructions are translated. Use the language selector to keep reading the same chapter in another language. Saved assessments and practice records are shared across languages within the same browser and site.

| Language | Web app | Markdown chapters |
| --- | --- | --- |
| 简体中文 | [Open](https://xialuyu5-oss.github.io/dual-quotient-manual/zh-CN/) | [Read](content/) |
| 繁體中文 | [Open](https://xialuyu5-oss.github.io/dual-quotient-manual/zh-TW/) | [Read](content/zh-TW/) |
| English | [Open](https://xialuyu5-oss.github.io/dual-quotient-manual/en/) | [Read](content/en/) |
| 日本語 | [Open](https://xialuyu5-oss.github.io/dual-quotient-manual/ja/) | [Read](content/ja/) |
| Deutsch | [Open](https://xialuyu5-oss.github.io/dual-quotient-manual/de/) | [Read](content/de/) |
| Русский | [Open](https://xialuyu5-oss.github.io/dual-quotient-manual/ru/) | [Read](content/ru/) |
| Français | [Open](https://xialuyu5-oss.github.io/dual-quotient-manual/fr/) | [Read](content/fr/) |

Existing Chinese URLs remain available. Repository introductions are provided in Simplified Chinese, Traditional Chinese, English and Japanese. Concrete translation corrections are welcome.

## Windows portable edition

[Download v0.2.0 for Windows x64](https://github.com/xialuyu5-oss/dual-quotient-manual/releases/tag/v0.2.0), fully extract `windows-x64.zip`, then double-click **双商训练手册.exe**. The handbook opens in your browser. Keep the launcher window open while using it; closing it stops the local service.

- No separate Node.js installation or commands. Reading, assessment and practice work offline with system fonts.
- Windows 10/11 x64 with the system .NET Framework 4.x. Keep the bundled `app` and `runtime` folders alongside the launcher.
- The launcher follows the Windows display language; the web interface offers all seven languages.
- The local address remains `http://127.0.0.1:43119/`, preserving records from the previous portable version when using the same browser. Web, development and portable addresses have separate storage.
- The launcher is unsigned. Windows may show an unknown-publisher notice.

## Screenshots

Actual application screenshots; the practice completion shown is demonstration data. The images below show the original Chinese interface.

![Home page with the four-level training map](docs/screenshots/home.jpg)

<details>
<summary>Assessment and practice screens</summary>

![The self-assessment asks about actual behavior](docs/screenshots/assessment.jpg)

![Daily practice, streaks and recent activity](docs/screenshots/practice.jpg)

</details>

## What it is

Two connected questions guide the handbook: **How do we see situations clearly, and how do we understand ourselves and others?** The Chinese concepts Dao, Fa, Shu and Qi organize both paths:

| Level | Thinking and judgment | Emotions and relationships |
| --- | --- | --- |
| **Qi · Tools** | Notes, checklists, decision logs, models | Emotion vocabulary, body awareness, journals, relationship ledgers |
| **Shu · Techniques** | Problem framing, inversion, probabilities, steelmanning | Naming feelings, listening, needs, feedback, repair |
| **Fa · Systems** | Reviews, decision categories, learning cycles, principles | Emotional rhythms, relationship maintenance, conflict agreements, daily reflection |
| **Dao · Understanding** | Recognizing ignorance, taking a long view, bearing consequences | Self-knowledge, humanity and steadiness |

“IQ/EQ” here describes a framework for practice. **The assessment is a reflection tool, not a standardized intelligence test, clinical assessment or guarantee of improvement.**

## Features

**Read:** Eighteen Markdown chapters per language, an eight-cell map, four development stages, estimated reading time, previous/next navigation, a desktop contents sidebar and a mobile drawer. You can also read all text directly on GitHub.

**Assess:** Twenty-four questions in four groups, answered on a five-point frequency scale. Three questions contribute to each path/level cell. Results show the eight-cell profile, stages, possible imbalances and reading suggestions. The latest eight results stay in the browser, with comparison to the preceding result.

**Practice:** Five daily items—morning questions, naming an emotion, a decision entry, reading and evening reflection—and six weekly items. Track streaks, total completed days and the last fourteen days. A day counts as complete only when all five daily items are done. Exercises link to relevant chapters; clearing practice history requires confirmation.

<details>
<summary>How scoring works</summary>

Each cell is the mean of its three answers. Stages are checked from Qi upward using a threshold of 3.5; the first level below that threshold determines the current practice stage. If all pass, the stage is Dao. Differences between levels and paths trigger predefined imbalance patterns.

These are heuristic project rules, without supplied population norms or psychometric validation. See [assessment.ts](src/lib/assessment.ts).

</details>

## Contents

| Part | Chapters |
| --- | --- |
| Preface | [Why clever people are often not wise](content/en/00-preface.md) |
| I · Map | [Cleverness and wisdom](content/en/01-cleverness-and-wisdom.md) · [Four levels](content/en/02-dao-fa-shu-qi.md) · [Know yourself](content/en/03-know-thyself.md) |
| II · Thinking | [Tools](content/en/04-iq-qi.md) · [Techniques](content/en/05-iq-shu.md) · [Systems](content/en/06-iq-fa.md) · [Judgment](content/en/07-iq-dao.md) |
| III · Emotions | [Tools](content/en/08-eq-qi.md) · [Techniques](content/en/09-eq-shu.md) · [Systems](content/en/10-eq-fa.md) · [Humanity, steadiness, clarity](content/en/11-eq-dao.md) |
| IV · Integration | [Joining the paths](content/en/12-integration.md) · [Transition](content/en/13-transition.md) · [Practice plan](content/en/14-practice-plan.md) · [Twelve traps](content/en/15-traps.md) |
| Appendices | [Reading and sources](content/en/16-reading-list.md) · [One-page overview](content/en/17-one-page.md) |

## Run and build

Requires **Node.js 20.9 or newer** and npm:

```bash
npm ci
npm run dev
```

Open [localhost:43117](http://localhost:43117). No database, login or AI service configuration is needed.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server on port 43117 |
| `npm run build` | Validate all languages, then build |
| `npm run start` | Run the normal server build on port 43117 |
| `npm run lint` | ESLint |
| `npm run test:i18n` | Locale paths, messages, placeholders and chapter parity |
| `npm run test:portable` | Local static-server tests |
| `npm run package:windows` | Windows x64 portable ZIP under `dist/` |

For normal production hosting, run `npm run build` then `npm run start`. For static output, set `GITHUB_PAGES=1` to export to `out/` with the repository path prefix, or `DQ_PORTABLE=1` to export to `.next-portable/`. Static exports do not use `npm run start`.

The [Pages workflow](.github/workflows/deploy-pages.yml) checks and publishes the complete static website after updates to `main`. Windows packaging uses the system C# compiler and bundles Node.js with its official license and dependency notices.

## Data and network behavior

- Assessment history and practice records use this browser's site-specific `localStorage`. There is no account, database, result-upload endpoint or application analytics.
- Unsubmitted answers are not persistently saved. Different browsers, devices and site addresses do not synchronize. Clearing site data removes records; no export/backup feature is currently provided.
- The web version requests Noto fonts from Google Fonts and falls back to system fonts. The portable version uses system fonts without that request.
- Cursor and Fable5.1 describe how the project was created. Scoring and recommendations use local rules; the running app does not call an AI model.

## Source and contributions

Next.js 16.3.5, React 19.2.8, TypeScript, Tailwind CSS v4, shadcn/ui, Base UI and Lucide. Markdown uses `gray-matter`, `react-markdown`, `remark-gfm` and `remark-breaks`. Exact versions are in [package-lock.json](package-lock.json).

```text
content/                  Chinese originals and six translated folders
src/app/[[...route]]/     Legacy and locale routes, layout and metadata
src/views/                Home, contents, chapter, assessment and practice
src/components/           Shared UI and interactive features
src/lib/i18n/             Seven dictionaries, locale paths and formatting
src/lib/content.ts        Chapter loading and reading order
src/lib/assessment.ts     Questions, scoring and recommendations
src/lib/practice.ts       Practice items, dates and streaks
packaging/                Launcher, local server, tests and Windows build
```

Chapters are prerendered during builds; interaction and storage happen in the browser. Edit Markdown frontmatter fields `label`, `title`, `subtitle` and `summary` for each language, keeping `slug`, `part`, `level` and `order` identical. All seven languages must contain the same chapters. Update every dictionary when adding a UI message and preserve named placeholders.

The content loader caches files in-process: restart development if edits do not appear, and rebuild production output. Changes to chapter slugs must also update assessment/practice links. Builds reject missing translations instead of silently substituting Chinese.

**Created with Cursor Vibe Coding, using the Fable5.1 model.**
