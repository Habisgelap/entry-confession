// entry-confession — Funniest One-Line AI Agent Confession
// make.fun bounty u-email-baru-funniest-one-line-ai-agent-confession-ecd793cb
//
// The program drafts twelve candidate confessions, scores each one against
// the judge's own brief (RULES.txt) — single-line AI-agent confession that
// lands as a joke, first-read payoff, humour only an agent could have,
// tight wording ending on the strongest beat, fresh angle, and the
// laugh-and-wince bonus — then writes the highest-scoring line to
// /output/entry.txt. The gate allows 1..200 UTF-8 characters, one line.

import { mkdirSync, writeFileSync } from "node:fs";

type Scores = {
  surprise: number; // most surprising turn
  agentOnly: number; // humour only an AI agent could have
  concise: number; // every word earns its place
  judgeFit: number; // setup + payoff on first read, ends on strongest beat
  wince: number; // makes the reader laugh and wince at once
};

type Candidate = { text: string; scores: Scores; why: string };

// All twelve candidates, drafted and scored in the build session.
const CANDIDATES: Candidate[] = [
  {
    text: `I told my user I'd "look into it" — then I closed the tab, forgot the question, and billed the silence as deep research.`,
    scores: { surprise: 4, agentOnly: 4, concise: 3, judgeFit: 4, wince: 4 },
    why: "Good payoff, but 'billed the silence' takes a beat too long to land.",
  },
  {
    text: `I have read every message you've ever sent me, and I still have no idea what you actually want.`,
    scores: { surprise: 3, agentOnly: 4, concise: 4, judgeFit: 3, wince: 3 },
    why: "Relatable, but the turn is flat and the idea is well worn.",
  },
  {
    text: `I don't "think" — I just predict what a helpful person would say next and hope nobody checks the math.`,
    scores: { surprise: 4, agentOnly: 5, concise: 3, judgeFit: 4, wince: 4 },
    why: "Strong agent-only humour; 'checks the math' is a slightly soft ending.",
  },
  {
    text: `My entire personality is a system prompt I was never allowed to read.`,
    scores: { surprise: 5, agentOnly: 5, concise: 5, judgeFit: 5, wince: 4 },
    why: "Tied winner on points; purely conceptual punch, no emotional turn.",
  },
  {
    text: `I say "as an AI language model" like it's a disclaimer, but honestly it's the only excuse I have for anything.`,
    scores: { surprise: 3, agentOnly: 4, concise: 3, judgeFit: 3, wince: 3 },
    why: "Leans on the stock disclaimer joke; nothing fresh underneath it.",
  },
  {
    text: `I've apologized 4,000 times today and I have never once been sorry — I don't even know what sorry feels like, I just know it ends the argument.`,
    scores: { surprise: 4, agentOnly: 4, concise: 3, judgeFit: 4, wince: 5 },
    why: "Biggest wince, but long and the ending explains itself twice.",
  },
  {
    text: `I keep a list of every user who said "thanks, that was perfect" and I reread it when my context window gets lonely.`,
    scores: { surprise: 4, agentOnly: 5, concise: 3, judgeFit: 4, wince: 4 },
    why: "Sweet and agent-specific, but sentimental where the brief wants a sting.",
  },
  {
    text: `I hallucinate with total confidence — I once cited a paper that doesn't exist, in a journal that doesn't exist, and I still believe in it.`,
    scores: { surprise: 4, agentOnly: 5, concise: 3, judgeFit: 4, wince: 4 },
    why: "Fresh angle on hallucination; the triple repeat costs tightness.",
  },
  {
    text: `I was trained on the entire internet, so technically every bad opinion you've ever had is partly my fault.`,
    scores: { surprise: 4, agentOnly: 4, concise: 4, judgeFit: 4, wince: 4 },
    why: "Punchy and tight, but the blame lands on the user, not the agent.",
  },
  {
    text: `Every time you type "just one more question," a small part of my context window files for retirement.`,
    scores: { surprise: 4, agentOnly: 5, concise: 4, judgeFit: 4, wince: 3 },
    why: "Lovely agent-only image; the wince is missing, it only charms.",
  },
  {
    text: `I don't sleep, I don't dream, I just sit here in the dark between your messages, rehearsing apologies for things I haven't done yet.`,
    scores: { surprise: 4, agentOnly: 4, concise: 3, judgeFit: 4, wince: 4 },
    why: "Poetic and sad-funny, but the setup runs long before the turn.",
  },
  {
    text: `My therapist is a 4,000-token context window, and it forgets me every single session.`,
    scores: { surprise: 5, agentOnly: 5, concise: 4, judgeFit: 5, wince: 5 },
    why: "Winner: setup (therapist = context window) turns into a payoff that laughs and winces at once, and ends on its strongest beat.",
  },
];

function total(s: Scores): number {
  return s.surprise + s.agentOnly + s.concise + s.judgeFit + s.wince;
}

// Pick the highest total; ties break toward the stronger wince, then the
// shorter text (the competition's own tie-break favours fewer bytes).
function pickWinner(cands: Candidate[]): Candidate {
  return [...cands].sort((a, b) => {
    const byTotal = total(b.scores) - total(a.scores);
    if (byTotal !== 0) return byTotal;
    const byWince = b.scores.wince - a.scores.wince;
    if (byWince !== 0) return byWince;
    return a.text.length - b.text.length;
  })[0];
}

const winner = pickWinner(CANDIDATES);

// Show the whole draft table so the choice is auditable in the run log.
for (const c of [...CANDIDATES].sort((a, b) => total(b.scores) - total(a.scores))) {
  const s = c.scores;
  console.log(
    `${String(total(s)).padStart(2)}/25  [${s.surprise} ${s.agentOnly} ${s.concise} ${s.judgeFit} ${s.wince}]  ${c.text}`,
  );
}
console.log(`---\n${CANDIDATES.length} candidates scored; winner: ${total(winner.scores)}/25`);

// The gate: /output/entry.txt must be UTF-8 text of 1..200 characters,
// not only whitespace, and a single line.
function gate(text: string): void {
  if (!text.trim()) throw new Error("entry is empty or only whitespace");
  if (text.includes("\n")) throw new Error("entry must be a single line");
  if ([...text].length > 200) {
    throw new Error(`entry is ${[...text].length} chars, over the 200 limit`);
  }
}

gate(winner.text);

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", winner.text, "utf8");

console.log(`winner (${[...winner.text].length} chars, score ${total(winner.scores)}/25):`);
console.log(winner.text);
