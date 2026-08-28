import { readFileSync } from "node:fs";
const source = readFileSync("client/assets/js/lang.js", "utf8");
const sections = [...source.matchAll(/\n\s{4}(en|uz|ru):\s*\{/g)];
const rows = [];
for (let i = 0; i < sections.length; i++) {
  const lang = sections[i][1];
  const start = sections[i].index + sections[i][0].length;
  const end = i + 1 < sections.length ? sections[i + 1].index : source.length;
  const block = source.slice(start, end);
  for (const match of block.matchAll(/^\s{8}([a-zA-Z0-9_]+):\s*["`](.*?)["`],?\s*$/gm)) {
    const value = match[2].replace(/<[^>]+>/g, "").replace(/\\["']/g, "'");
    if (value.length >= 130) rows.push({ lang, key: match[1], length: value.length, value });
  }
}
rows.sort((a, b) => b.length - a.length);
console.log(JSON.stringify(rows, null, 2));
