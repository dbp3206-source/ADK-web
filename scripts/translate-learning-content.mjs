import { readFile, writeFile } from "node:fs/promises";

const files = [
  ["content/learning/flashcards.vi.json", "content/learning/flashcards.en.json"],
  ["content/learning/question-bank.vi.json", "content/learning/question-bank.en.json"],
  ["content/learning/practice-activities.vi.json", "content/learning/practice-activities.en.json"],
];

const skipKeys = new Set([
  "id",
  "module",
  "difficulty",
  "type",
  "project",
  "answer",
  "projectLinks",
  "sourceLinks",
  "tags",
  "conceptId",
  "term",
]);

const cachePath = "design-work/working/learning-translation-cache.json";
let cache = {};
try {
  cache = JSON.parse(await readFile(cachePath, "utf8"));
} catch {
  cache = {};
}

function shouldTranslate(key, value) {
  if (skipKeys.has(key)) return false;
  if (!/[À-ỹ]/u.test(value)) return false;
  return true;
}

async function translateText(text) {
  if (cache[text]) return cache[text];
  const params = new URLSearchParams({
    client: "gtx",
    sl: "vi",
    tl: "en",
    dt: "t",
    q: text,
  });
  let lastError;
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    try {
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?${params}`,
        { signal: AbortSignal.timeout(20_000) },
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const translated = data[0].map((part) => part[0]).join("");
      cache[text] = translated;
      return translated;
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, attempt * 500));
    }
  }
  throw new Error(`Translation failed after retries: ${lastError}`);
}

async function collect(node, key = "") {
  const values = [];
  if (Array.isArray(node)) {
    for (const item of node) values.push(...(await collect(item, key)));
  } else if (node && typeof node === "object") {
    for (const [childKey, value] of Object.entries(node)) {
      values.push(...(await collect(value, childKey)));
    }
  } else if (typeof node === "string" && shouldTranslate(key, node)) {
    values.push(node);
  }
  return values;
}

async function replace(node, key = "") {
  if (Array.isArray(node)) {
    return Promise.all(node.map((item) => replace(item, key)));
  }
  if (node && typeof node === "object") {
    const entries = await Promise.all(
      Object.entries(node).map(async ([childKey, value]) => [
        childKey,
        await replace(value, childKey),
      ]),
    );
    return Object.fromEntries(entries);
  }
  if (typeof node === "string" && shouldTranslate(key, node)) {
    return cache[node] ?? node;
  }
  return node;
}

const documents = [];
const strings = new Set();
for (const [input, output] of files) {
  const data = JSON.parse(await readFile(input, "utf8"));
  documents.push({ output, data });
  for (const value of await collect(data)) strings.add(value);
}

const queue = [...strings].filter((value) => !cache[value]);
let cursor = 0;
const workers = Array.from({ length: 8 }, async () => {
  while (cursor < queue.length) {
    const index = cursor;
    cursor += 1;
    await translateText(queue[index]);
    if ((index + 1) % 40 === 0) {
      process.stdout.write(`Translated ${index + 1}/${queue.length}\n`);
      await writeFile(cachePath, `${JSON.stringify(cache, null, 2)}\n`, "utf8");
    }
  }
});
await Promise.all(workers);
await writeFile(cachePath, `${JSON.stringify(cache, null, 2)}\n`, "utf8");

for (const { output, data } of documents) {
  const translated = await replace(data);
  await writeFile(output, `${JSON.stringify(translated, null, 2)}\n`, "utf8");
  process.stdout.write(`Wrote ${output}\n`);
}
