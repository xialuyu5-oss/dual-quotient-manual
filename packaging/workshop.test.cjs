const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const matter = require('gray-matter');
const root = path.resolve(__dirname, '..');
function load(relative, overrides = {}) {
  const filename = path.join(root, relative);
  const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } });
  const loaded = new Module(filename, module);
  loaded.filename = filename;
  loaded.paths = Module._nodeModulePaths(path.dirname(filename));
  loaded.require = name => overrides[name] ?? Module.prototype.require.call(loaded, name);
  loaded._compile(compiled.outputText, filename);
  return loaded.exports;
}
const records = load('src/lib/workshop/records.ts');
const { parseWorkbook, mergeWorkbook, updateDraft, EMPTY_WORKBOOK, WORKSHOP_KEY } = records;
const { LOCALES } = load('src/lib/i18n/locales.ts');
const example = { id: 'record-1', template: 'decision', createdAt: '2026-09-20T10:00:00.000Z', values: { situation: '中文 / 한국어 / Español <script>plain text</script>', choice: 'Keep the original words' } };

test('all nine workshops retain complete structure, stable IDs and valid cross-links', () => {
  const source = JSON.parse(fs.readFileSync(path.join(root, 'content/workshop/zh-CN.json'), 'utf8'));
  const slugs = new Set(fs.readdirSync(path.join(root, 'content')).filter(p => p.endsWith('.md')).map(p => matter(fs.readFileSync(path.join(root, 'content', p), 'utf8')).data.slug));
  function compare(value, original, key = '') {
    assert.equal(typeof value, typeof original, key);
    if (typeof original === 'string') {
      assert.ok(value.trim(), key);
      assert.doesNotMatch(value, /TODO_TRANSLATE|TRANSLATION_PENDING|待翻译/, key);
      if (['id', 'template', 'chapter'].includes(key.split('.').at(-1))) assert.equal(value, original, key);
    } else {
      assert.equal(Array.isArray(value), Array.isArray(original), key);
      assert.deepEqual(Object.keys(value).sort(), Object.keys(original).sort(), key);
      for (const item of Object.keys(original)) compare(value[item], original[item], `${key}.${item}`);
    }
  }
  for (const locale of LOCALES) {
    const content = JSON.parse(fs.readFileSync(path.join(root, `content/workshop/${locale}.json`), 'utf8'));
    compare(content, source, locale);
    for (const group of [content.cases, content.templates, content.topics]) assert.equal(new Set(group.map(x => x.id)).size, group.length);
    const templateIds = new Set(content.templates.map(x => x.id));
    for (const item of content.cases) { assert.ok(slugs.has(item.chapter)); assert.ok(templateIds.has(item.template)); assert.ok(item.options.length >= 2); }
    for (const item of content.templates) assert.equal(new Set(item.fields.map(x => x.id)).size, item.fields.length);
    const dictionary = JSON.parse(fs.readFileSync(path.join(root, `src/lib/i18n/dictionaries/${locale}.json`), 'utf8'));
    assert.equal(dictionary['实践工坊'], content.title);
  }
  assert.equal(source.cases.length, 8);
  assert.equal(source.templates.length, 4);
  assert.equal(source.topics.length, 6);
});

test('drafts remain independent and multilingual records round-trip without altering user text', () => {
  const first = updateDraft(EMPTY_WORKBOOK, 'decision', 'situation', example.values.situation);
  const second = updateDraft(first, 'emotion', 'situation', '別の出来事');
  const store = { ...second, entries: [example] };
  assert.deepEqual(parseWorkbook(JSON.stringify(store)), store);
  assert.equal(first.drafts.emotion, undefined);
  assert.equal(store.drafts.decision.situation, example.values.situation);
  assert.deepEqual(EMPTY_WORKBOOK, { version: 1, drafts: {}, entries: [] });
});

test('import preserves current drafts, deduplicates identical records and retains future fields', () => {
  const current = { version: 1, drafts: { decision: { situation: 'Keep current' } }, entries: [example] };
  const incoming = parseWorkbook(JSON.stringify({ version: 1, drafts: { decision: { situation: 'Old copy' }, future: { newfield: 'Preserve me' } }, entries: [{ ...example, values: { choice: example.values.choice, situation: example.values.situation } }] }));
  const merged = mergeWorkbook(current, incoming);
  assert.equal(merged.drafts.decision.situation, 'Keep current');
  assert.equal(merged.drafts.future.newfield, 'Preserve me');
  assert.equal(merged.entries.length, 1);
  const conflict = { ...incoming, entries: [{ ...example, values: { situation: 'Conflicting edit' } }] };
  assert.throws(() => mergeWorkbook(current, conflict), /Conflicting/);
  assert.equal(current.entries[0].values.situation, example.values.situation);
});

test('malformed backups, duplicate records and prototype fields are rejected before writing', () => {
  for (const raw of ['{', 'null', '{"version":2,"drafts":{},"entries":[]}', '{"version":1,"drafts":{"__proto__":{}},"entries":[]}', '{"version":1,"drafts":{"decision":{"constructor":"bad"}},"entries":[]}']) assert.throws(() => parseWorkbook(raw));
  for (const entries of [[example, example], [{ ...example, createdAt: 'invalid' }], [{ ...example, values: { x: 123 } }], [{ ...example, values: { x: 'x'.repeat(10001) } }]]) assert.throws(() => parseWorkbook(JSON.stringify({ version: 1, drafts: {}, entries })));
});

function storageHarness(raw = null) {
  let stored = raw, fails = false, writes = 0;
  global.window = { localStorage: { getItem: () => stored, setItem: (_key, value) => { writes++; if (fails) throw new Error('QuotaExceededError'); stored = value; } } };
  const hook = load('src/hooks/use-workbook.ts', {
    '@/lib/workshop/records': records,
    react: { useSyncExternalStore: (_subscribe, getSnapshot) => getSnapshot() },
  }).useWorkbook;
  return { hook, fail: value => { fails = value; }, stored: () => stored, writes: () => writes };
}
test('a failed browser save retains input, reports failure and can recover on a later write', () => {
  const h = storageHarness(); h.fail(true);
  assert.equal(h.hook().write(s => updateDraft(s, 'decision', 'situation', 'Do not lose me')), false);
  assert.equal(h.hook().issue, 'unavailable');
  assert.equal(h.hook().store.drafts.decision.situation, 'Do not lose me');
  assert.equal(h.stored(), null);
  h.fail(false);
  assert.equal(h.hook().write(s => updateDraft(s, 'decision', 'choice', 'Recovered')), true);
  assert.equal(h.hook().issue, '');
  assert.equal(parseWorkbook(h.stored()).drafts.decision.situation, 'Do not lose me');
  delete global.window;
});
test('unreadable saved data is never overwritten and new input remains available to export', () => {
  const h = storageHarness('broken original');
  assert.equal(h.hook().issue, 'invalid');
  assert.equal(h.hook().write(s => updateDraft(s, 'emotion', 'situation', 'New note')), false);
  assert.equal(h.hook().store.drafts.emotion.situation, 'New note');
  assert.equal(h.stored(), 'broken original'); assert.equal(h.writes(), 0);
  assert.notEqual(WORKSHOP_KEY, 'dq.assessment.v1'); assert.notEqual(WORKSHOP_KEY, 'dq.practice.v1');
  delete global.window;
});
