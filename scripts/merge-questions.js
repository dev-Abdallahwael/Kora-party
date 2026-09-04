const fs = require("fs");
const path = require("path");

const DIR = path.join(__dirname, "..", "questions ar and en");
const OUT = path.join(__dirname, "..", "kora-party-app", "src", "data");

function read(name) {
  const raw = fs.readFileSync(path.join(DIR, name), "utf8");
  const data = JSON.parse(raw);
  return data;
}

function mergeArrays(bilingual, updated, idPrefix) {
  const map = new Map();
  for (const q of bilingual) {
    map.set(q.id, q);
  }
  for (const q of updated) {
    if (!map.has(q.id)) {
      map.set(q.id, q);
    }
  }
  return Array.from(map.values());
}

function addArabicFields(entries, fields) {
  return entries.map((e) => {
    const out = { ...e };
    for (const f of fields) {
      if (!out[f]) out[f] = "";
    }
    return out;
  });
}

// 1. Guess the Player
const gtpBi = read("bundle-guess-the-player-bilingual.json");
const gtpUp = read("bundle-guess-the-player-2000s-hard.json");
const gtp = addArabicFields(
  mergeArrays(gtpBi, gtpUp, "gtp"),
  ["clueAr", "answerAr", "acceptedAnswersAr"]
);
fs.writeFileSync(path.join(OUT, "guess-the-player.json"), JSON.stringify(gtp, null, 2));
console.log(`guess-the-player: ${gtp.length} questions`);

// 2. Guess by History
const gbhBi = read("bundle-guess-by-history-bilingual.json");
const gbhUp = read("bundle-guess-by-history-nerd-updated.json");
const gbh = addArabicFields(
  mergeArrays(gbhBi, gbhUp, "gbh"),
  ["clubsAr", "answerAr", "acceptedAnswersAr"]
);
fs.writeFileSync(path.join(OUT, "guess-by-history.json"), JSON.stringify(gbh, null, 2));
console.log(`guess-by-history: ${gbh.length} questions`);

// 3. Guess the Nation
const gtnBi = read("bundle-guess-the-nation-bilingual.json");
const gtnUp = read("bundle-guess-the-nation-nerd-updated.json");
const gtn = addArabicFields(
  mergeArrays(gtnBi, gtnUp, "gtn"),
  ["wikipediaLookupAr", "correctNationAr", "optionsAr"]
);
fs.writeFileSync(path.join(OUT, "guess-the-nation.json"), JSON.stringify(gtn, null, 2));
console.log(`guess-the-nation: ${gtn.length} questions`);

// 4. Higher or Lower
const holBi = read("bundle-higher-or-lower-bilingual.json");
const holUp = read("bundle-higher-or-lower-updated.json");
const hol = addArabicFields(
  mergeArrays(holBi, holUp, "hol"),
  ["statLabelAr", "playerAAr", "playerBAr", "correctAnswerAr", "noteAr"]
);
fs.writeFileSync(path.join(OUT, "higher-or-lower.json"), JSON.stringify(hol, null, 2));
console.log(`higher-or-lower: ${hol.length} questions`);

// 5. True or False
const tofBi = read("bundle-true-or-false-bilingual.json");
const tofUp = read("bundle-true-or-false-nerd-updated.json");
const tof = addArabicFields(
  mergeArrays(tofBi, tofUp, "tof"),
  ["statementAr", "answerAr"]
);
fs.writeFileSync(path.join(OUT, "true-or-false.json"), JSON.stringify(tof, null, 2));
console.log(`true-or-false: ${tof.length} questions`);

// 6. Complete the Lineup
const ctlBi = read("bundle-complete-the-lineup-bilingual.json");
const ctlUp = read("bundle-complete-the-lineup-updated.json");
const ctlMerged = [...(ctlUp.lineups || [])];
for (const l of ctlBi.lineups || []) {
  if (!ctlMerged.find((m) => m.id === l.id)) ctlMerged.push(l);
}
const ctl = ctlMerged.map((l) => ({
  ...l,
  titleAr: l.titleAr || "",
  knownPlayersAr: l.knownPlayersAr || [],
  blankedPositionAr: l.blankedPositionAr || "",
  answerAr: l.answerAr || "",
}));
fs.writeFileSync(path.join(OUT, "complete-the-lineup.json"), JSON.stringify(ctl, null, 2));
console.log(`complete-the-lineup: ${ctl.length} questions`);

// 7. Guess by Silhouette (stub — just suggested players)
const gbsBi = read("bundle-guess-by-silhouette-bilingual.json");
const gbsUp = read("bundle-guess-by-silhouette-updated.json");
const gbs = [
  ...(gbsBi.suggestedPlayers || []),
  ...(gbsUp.suggestedPlayers || []),
];
fs.writeFileSync(path.join(OUT, "guess-by-silhouette.json"), JSON.stringify(gbs, null, 2));
console.log(`guess-by-silhouette: ${gbs.length} suggested players (stub)`);

console.log("\nDone! All merged bundles written to src/data/");
