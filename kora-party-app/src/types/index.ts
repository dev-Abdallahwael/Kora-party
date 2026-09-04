export type BundleType =
  | "guess-the-player"
  | "guess-by-history"
  | "guess-the-nation"
  | "higher-or-lower"
  | "complete-the-lineup"
  | "guess-by-silhouette"
  | "true-or-false";

export interface Player {
  id: string;
  name: string;
  isHost: boolean;
  score: number;
  answers: PlayerAnswer[];
}

export interface PlayerAnswer {
  questionId: string;
  answer: string;
  isCorrect: boolean;
  answeredAt: number;
}

export interface GameSession {
  id: string;
  hostId: string;
  status: "waiting" | "playing" | "level-transition" | "finished";
  currentLevel: number;
  currentQuestionIndex: number;
  bundles: BundleType[];
  players: { [key: string]: Player };
  createdAt: number;
  questionOrder: string[];
}

export interface Question {
  id: string;
  type: BundleType;
  level: number;
  data: any;
}

export interface GameState {
  session: GameSession | null;
  currentQuestion: Question | null;
  timeLeft: number;
  isAnswered: boolean;
  selectedAnswer: string | null;
  showResult: boolean;
  localPlayerId: string;
}
