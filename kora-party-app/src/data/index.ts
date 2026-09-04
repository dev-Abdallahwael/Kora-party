import { BundleType } from "../types";

import gtpData from "./guess-the-player.json";
import gbhData from "./guess-by-history.json";
import gtnData from "./guess-the-nation.json";
import holData from "./higher-or-lower.json";
import tofData from "./true-or-false.json";
import ctlData from "./complete-the-lineup.json";
import gbsData from "./guess-by-silhouette.json";

export type QuestionData = Record<string, any>;

export interface BundleData {
  type: BundleType;
  questions: QuestionData[];
}

const ALL_BUNDLES: Record<BundleType, QuestionData[]> = {
  "guess-the-player": gtpData,
  "guess-by-history": gbhData,
  "guess-the-nation": gtnData,
  "higher-or-lower": holData,
  "true-or-false": tofData,
  "complete-the-lineup": ctlData,
  "guess-by-silhouette": gbsData.map((s: string) => ({ name: s })),
};

export function getBundleData(type: BundleType): QuestionData[] {
  return ALL_BUNDLES[type] || [];
}

export function getAllBundleTypes(): BundleType[] {
  return Object.keys(ALL_BUNDLES) as BundleType[];
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const rand = mulberry32(seed);
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function buildQuestionSet(
  selectedBundles: BundleType[],
  totalQuestions: number = 30,
  seed?: number
): { type: BundleType; data: QuestionData }[] {
  const perBundle = Math.ceil(totalQuestions / selectedBundles.length);
  let allQuestions: { type: BundleType; data: QuestionData }[] = [];

  for (let bi = 0; bi < selectedBundles.length; bi++) {
    const bundle = selectedBundles[bi];
    const pool = seed !== undefined
      ? seededShuffle(getBundleData(bundle), seed + bi * 173)
      : shuffle(getBundleData(bundle));
    const picked = pool.slice(0, perBundle);
    for (const q of picked) {
      allQuestions.push({ type: bundle, data: q });
    }
  }

  allQuestions = seed !== undefined
    ? seededShuffle(allQuestions, seed + 999)
    : shuffle(allQuestions);

  return allQuestions.slice(0, totalQuestions);
}

export function splitIntoLevels(
  questions: { type: BundleType; data: QuestionData }[],
  levels: number = 3
): { type: BundleType; data: QuestionData }[][] {
  const result: { type: BundleType; data: QuestionData }[][] = [];
  const perLevel = Math.ceil(questions.length / levels);
  for (let i = 0; i < levels; i++) {
    result.push(questions.slice(i * perLevel, (i + 1) * perLevel));
  }
  return result;
}

export function checkAnswer(
  type: BundleType,
  questionData: QuestionData,
  playerAnswer: string
): boolean {
  switch (type) {
    case "guess-the-player": {
      const accepted = (questionData.acceptedAnswers || []).map((a: string) =>
        a.toLowerCase().trim()
      );
      const answer = playerAnswer.toLowerCase().trim();
      return accepted.includes(answer);
    }
    case "guess-by-history": {
      const accepted = (questionData.acceptedAnswers || []).map((a: string) =>
        a.toLowerCase().trim()
      );
      const answer = playerAnswer.toLowerCase().trim();
      return accepted.includes(answer);
    }
    case "guess-the-nation": {
      return (
        playerAnswer.toLowerCase().trim() ===
        questionData.correctNation?.toLowerCase().trim()
      );
    }
    case "higher-or-lower": {
      return (
        playerAnswer.toLowerCase().trim() ===
        questionData.correctAnswer?.toLowerCase().trim()
      );
    }
    case "complete-the-lineup": {
      return (
        playerAnswer.toLowerCase().trim() ===
        questionData.answer?.toLowerCase().trim()
      );
    }
    case "guess-by-silhouette": {
      return (
        playerAnswer.toLowerCase().trim() ===
        questionData.toLowerCase?.().trim() ||
        playerAnswer.toLowerCase().trim() ===
          questionData.answer?.toLowerCase().trim()
      );
    }
    case "true-or-false": {
      const expected = questionData.answer ? "true" : "false";
      return playerAnswer.toLowerCase().trim() === expected;
    }
    default:
      return false;
  }
}
