import {
  ref,
  set,
  get,
  onValue,
  onDisconnect,
  remove,
  update,
} from "firebase/database";
import { db } from "./firebase";
import { BundleType } from "../types";

export interface FirebasePlayer {
  id: string;
  name: string;
  isHost: boolean;
  score: number;
  connected: boolean;
  lastAnswerAt?: number;
}

export interface FirebaseSession {
  id: string;
  hostId: string;
  status: "waiting" | "playing" | "level-transition" | "finished";
  bundles: BundleType[];
  currentLevel: number;
  currentQuestionIndex: number;
  seed: number;
  questionCount: number;
  phaseStartedAt: number;
  players: { [key: string]: FirebasePlayer };
  createdAt: number;
}

function generateSessionId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let id = "";
  for (let i = 0; i < 6; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

export async function createSession(
  hostId: string,
  hostName: string,
  bundles: BundleType[]
): Promise<string> {
  const sessionId = generateSessionId();
  const sessionRef = ref(db, `sessions/${sessionId}`);

  const session: FirebaseSession = {
    id: sessionId,
    hostId,
    status: "waiting",
    bundles,
    currentLevel: 0,
    currentQuestionIndex: 0,
    seed: Math.floor(Math.random() * 1_000_000),
    questionCount: 30,
    phaseStartedAt: Date.now(),
    players: {
      [hostId]: {
        id: hostId,
        name: hostName,
        isHost: true,
        score: 0,
        connected: true,
      },
    },
    createdAt: Date.now(),
  };

  await set(sessionRef, session);
  return sessionId;
}

export async function joinSession(
  sessionId: string,
  playerId: string,
  playerName: string
): Promise<boolean> {
  const playerRef = ref(db, `sessions/${sessionId}/players/${playerId}`);
  const snapshot = await get(playerRef);

  if (snapshot.exists()) {
    await set(playerRef, {
      ...snapshot.val(),
      connected: true,
    });
    return true;
  }

  const sessionRef = ref(db, `sessions/${sessionId}`);
  const sessionSnap = await get(sessionRef);
  if (!sessionSnap.exists()) return false;

  await set(playerRef, {
    id: playerId,
    name: playerName,
    isHost: false,
    score: 0,
    connected: true,
  });

  setupDisconnectHandler(sessionId, playerId);
  return true;
}

export function setupDisconnectHandler(sessionId: string, playerId: string) {
  const playerRef = ref(db, `sessions/${sessionId}/players/${playerId}`);
  const connectedRef = ref(db, `.info/connected`);

  onValue(connectedRef, (snap) => {
    if (snap.val() === true) {
      onDisconnect(playerRef).update({ connected: false });
    }
  });
}

export function listenToSession(
  sessionId: string,
  callback: (session: FirebaseSession | null) => void
): () => void {
  const sessionRef = ref(db, `sessions/${sessionId}`);
  const unsubscribe = onValue(sessionRef, (snap) => {
    callback(snap.val() as FirebaseSession | null);
  });
  return unsubscribe;
}

export async function startGame(sessionId: string, seed: number) {
  await update(ref(db), {
    [`sessions/${sessionId}/status`]: "playing",
    [`sessions/${sessionId}/phaseStartedAt`]: Date.now(),
    [`sessions/${sessionId}/currentLevel`]: 0,
    [`sessions/${sessionId}/currentQuestionIndex`]: 0,
    [`sessions/${sessionId}/seed`]: seed,
  });
}

export async function advanceToLevel(sessionId: string, level: number) {
  await update(ref(db), {
    [`sessions/${sessionId}/status`]: "playing",
    [`sessions/${sessionId}/currentLevel`]: level,
    [`sessions/${sessionId}/currentQuestionIndex`]: 0,
    [`sessions/${sessionId}/phaseStartedAt`]: Date.now(),
  });
}

export async function advanceQuestion(
  sessionId: string,
  level: number,
  questionIndex: number
) {
  await update(ref(db), {
    [`sessions/${sessionId}/currentLevel`]: level,
    [`sessions/${sessionId}/currentQuestionIndex`]: questionIndex,
    [`sessions/${sessionId}/phaseStartedAt`]: Date.now(),
  });
}

export async function submitAnswer(
  sessionId: string,
  playerId: string,
  questionKey: string,
  isCorrect: boolean,
  newScore: number
) {
  await update(ref(db), {
    [`sessions/${sessionId}/players/${playerId}/score`]: newScore,
    [`sessions/${sessionId}/players/${playerId}/answers/${questionKey}`]: {
      correct: isCorrect,
      at: Date.now(),
    },
  });
}

export async function setLevelTransition(sessionId: string, level: number) {
  await update(ref(db), {
    [`sessions/${sessionId}/status`]: "level-transition",
    [`sessions/${sessionId}/currentLevel`]: level,
  });
}

export async function transferHost(
  sessionId: string,
  newHostId: string
) {
  const sessionRef = ref(db, `sessions/${sessionId}`);
  const snapshot = await get(sessionRef);
  if (!snapshot.exists()) return;

  const session = snapshot.val() as FirebaseSession;
  const updates: Record<string, any> = {};

  for (const [pid, player] of Object.entries(session.players)) {
    updates[`sessions/${sessionId}/players/${pid}/isHost`] = pid === newHostId;
  }
  updates[`sessions/${sessionId}/hostId`] = newHostId;

  await update(ref(db), updates);
}

export async function checkAndTransferHost(sessionId: string) {
  const sessionRef = ref(db, `sessions/${sessionId}`);
  const snapshot = await get(sessionRef);
  if (!snapshot.exists()) return;

  const session = snapshot.val() as FirebaseSession;
  const hostPlayer = session.players[session.hostId];

  if (!hostPlayer || !hostPlayer.connected) {
    const connectedPlayers = Object.entries(session.players).filter(
      ([, p]) => p.connected
    );
    if (connectedPlayers.length > 0) {
      await transferHost(sessionId, connectedPlayers[0][0]);
    }
  }
}

export function removePlayer(sessionId: string, playerId: string) {
  const playerRef = ref(db, `sessions/${sessionId}/players/${playerId}`);
  remove(playerRef);
}

export async function endSession(sessionId: string) {
  const sessionRef = ref(db, `sessions/${sessionId}`);
  await set(ref(db, `sessions/${sessionId}/status`), "finished");
}
