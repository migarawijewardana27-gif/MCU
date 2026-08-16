const fs = require('fs');
const content = fs.readFileSync('src/data/marvelTitles.ts', 'utf8');

const regex = /{ title: "([^"]+)", releaseYear: (\d+), type: "([^"]+)"(.*?)}/g;
let match;
const titles = [];

while ((match = regex.exec(content)) !== null) {
  const isEssentialStr = match[4].includes('isEssential: true');
  titles.push({
    title: match[1],
    year: match[2],
    type: match[3],
    isEssential: isEssentialStr
  });
}

let md = '# Marvel Titles Classification\n\n';
md += 'Please mark the titles that are ESSENTIAL with an `[x]`. Leave the non-essential ones as `[ ]`.\n\n';

for (const t of titles) {
  const check = t.isEssential ? '[x]' : '[ ]';
  md += `- ${check} **${t.title}** (${t.year}, ${t.type})\n`;
}

fs.writeFileSync('title_classification.md', md);
console.log(`Wrote ${titles.length} titles to title_classification.md`);
