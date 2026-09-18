const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");
const matter = require("gray-matter");
const root = path.resolve(__dirname, "..");

// Use the project's compiler so these tests also run on the supported Node 20.
function loadTypeScript(relativePath) {
  const filename = path.join(root, relativePath);
  const compiled = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    fileName: filename,
  });
  const loaded = new Module(filename, module);
  loaded.filename = filename;
  loaded.paths = Module._nodeModulePaths(path.dirname(filename));
  loaded._compile(compiled.outputText, filename);
  return loaded.exports;
}
const localeHelpers = loadTypeScript("src/lib/i18n/locales.ts");
const translationHelpers = loadTypeScript("src/lib/i18n/messages.ts");

test("language switching retains chapter, query, and fragment without duplicating the locale", async () => {
  const { localizedPath, stripLocale } = localeHelpers;
  const chapter = "/en/manual/iq-dao/?view=wide#judgment";
  assert.equal(localizedPath("ja", chapter), "/ja/manual/iq-dao/?view=wide#judgment");
  assert.equal(stripLocale(chapter), "/manual/iq-dao/?view=wide#judgment");
  assert.equal(localizedPath("zh-CN", "/"), "/zh-CN/");
  assert.equal(localizedPath("de", "/de"), "/de/");
  assert.equal(localizedPath("fr", "/manual/preface"), "/fr/manual/preface");
});

test("localized links leave outside destinations and same-page anchors intact", async () => {
  const { localizedPath } = localeHelpers;
  for (const href of ["https://github.com/xialuyu5-oss/dual-quotient-manual", "//example.com/", "#intro", "?page=2", "mailto:hello@example.com"]) {
    assert.equal(localizedPath("en", href), href);
  }
});

test("whole-sentence placeholders support grammatical reordering and repeated values", async () => {
  const { createTranslator } = translationHelpers;
  const t = createTranslator({ progress: "{done} von {total} abgeschlossen ({done})" });
  assert.equal(t("progress", { total: 5, done: 2 }), "2 von 5 abgeschlossen (2)");
  assert.equal(t("Missing source message"), "Missing source message");
  assert.equal(t("progress", { done: 2 }), "2 von {total} abgeschlossen (2)");
});

test("dates and decimals follow the chosen language", async () => {
  const { formatDate, formatNumber } = localeHelpers;
  assert.equal(formatNumber("de", 3.5, 1), "3,5");
  assert.equal(formatNumber("en", 3.5, 1), "3.5");
  assert.match(formatDate("ja", new Date(2026, 8, 18)), /2026.*9.*18/);
  assert.equal(formatDate("en", "invalid"), "—");
});

test("all supported interface dictionaries have complete messages and matching placeholders", () => {
  const folder = path.join(root, "src/lib/i18n/dictionaries");
  const source = JSON.parse(fs.readFileSync(path.join(folder, "zh-CN.json"), "utf8"));
  const placeholders = value => [...value.matchAll(/\{([a-zA-Z][a-zA-Z0-9_]*)\}/g)].map(m => m[1]).sort();
  for (const locale of localeHelpers.LOCALES) {
    const messages = JSON.parse(fs.readFileSync(path.join(folder, `${locale}.json`), "utf8"));
    assert.deepEqual(Object.keys(messages).sort(), Object.keys(source).sort(), `${locale}: missing or extra messages`);
    for (const [key, value] of Object.entries(messages)) {
      assert.equal(typeof value, "string", `${locale}: ${key}`);
      assert.ok(value.trim(), `${locale}: empty ${key}`);
      assert.deepEqual(placeholders(value), placeholders(source[key]), `${locale}: placeholders in ${key}`);
    }
  }
});

test("the full requested language set is available and recognizable in Chinese", () => {
  const { LOCALES, languageLabel, localizedPath } = localeHelpers;
  assert.deepEqual([...LOCALES].sort(), ["zh-CN", "zh-TW", "en", "ja", "ko", "de", "ru", "es", "fr"].sort());
  assert.equal(languageLabel("ko", "zh-CN"), "韩国语 · 한국어");
  assert.equal(languageLabel("es", "zh-CN"), "西班牙语 · Español");
  assert.equal(languageLabel("de", "zh-CN"), "德语 · Deutsch");
  assert.equal(languageLabel("ru", "zh-CN"), "俄语 · Русский");
  assert.equal(languageLabel("ru", "zh-TW"), "俄語 · Русский");
  assert.equal(languageLabel("ko", "en"), "한국어");
  assert.equal(localizedPath("es", "/ko/manual/preface?from=nav#practice"), "/es/manual/preface?from=nav#practice");
});

test("every language contains all 18 complete chapter structures with stable identities", () => {
  const folder = path.join(root, "content");
  const files = fs.readdirSync(folder).filter(file => file.endsWith(".md")).sort();
  assert.equal(files.length, 18);
  const outline = text => [...text.matchAll(/^(#{2,3}) /gm)].map(m => m[1]);
  const tableRows = text => (text.match(/^\|/gm) || []).length;
  for (const locale of localeHelpers.LOCALES) {
    const translatedFolder = locale === "zh-CN" ? folder : path.join(folder, locale);
    assert.deepEqual(fs.readdirSync(translatedFolder).filter(file => file.endsWith(".md")).sort(), files, `${locale}: chapter set`);
    const slugs = new Set();
    for (const file of files) {
      const source = matter(fs.readFileSync(path.join(folder, file), "utf8"));
      const translated = matter(fs.readFileSync(path.join(translatedFolder, file), "utf8"));
      for (const key of ["slug", "part", "level", "order"]) {
        assert.equal(translated.data[key], source.data[key], `${locale}/${file}: ${key}`);
      }
      for (const key of ["label", "title", "subtitle", "summary"]) {
        assert.ok(typeof translated.data[key] === "string" && translated.data[key].trim(), `${locale}/${file}: ${key}`);
      }
      assert.ok(!slugs.has(translated.data.slug), `${locale}: duplicate slug`);
      slugs.add(translated.data.slug);
      assert.deepEqual(outline(translated.content), outline(source.content), `${locale}/${file}: heading hierarchy`);
      assert.equal(tableRows(translated.content), tableRows(source.content), `${locale}/${file}: table rows`);
      assert.ok(translated.content.trim().length > 500, `${locale}/${file}: unexpectedly short body`);
      assert.doesNotMatch(translated.content, /(?:TODO_TRANSLATE|TRANSLATION_PENDING|待翻译)/, `${locale}/${file}: unfinished translation`);
    }
  }
});
