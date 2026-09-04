import { useState, useEffect, useCallback, useRef } from "react";
import { BundleType } from "../types";
import {
  buildQuestionSet,
  splitIntoLevels,
  checkAnswer,
  QuestionData,
} from "../data";

export interface GameQuestion {
  type: BundleType;
  data: QuestionData;
}

export interface GameEngineState {
  status: "setup" | "playing" | "level-transition" | "finished";
  currentLevel: number;
  currentQuestionIndex: number;
  questions: GameQuestion[][];
  currentQuestion: GameQuestion | null;
  timeLeft: number;
  score: number;
  totalQuestions: number;
  answers: { questionIndex: number; correct: boolean; answer: string }[];
}

const TIMER_SECONDS = 15;
const SCORE_PER_CORRECT = 10;

export function useGameEngine() {
  const [state, setState] = useState<GameEngineState>({
    status: "setup",
    currentLevel: 0,
    currentQuestionIndex: 0,
    questions: [],
    currentQuestion: null,
    timeLeft: TIMER_SECONDS,
    score: 0,
    totalQuestions: 0,
    answers: [],
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    timerRef.current = setInterval(() => {
      setState((prev) => {
        if (prev.timeLeft <= 1) {
          clearTimer();
          setShowResult(true);
          setIsAnswered(true);
          return { ...prev, timeLeft: 0 };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
  }, [clearTimer]);

  const startGame = useCallback(
    (selectedBundles: BundleType[], questionsPerLevel: number = 10) => {
      const allQs = buildQuestionSet(
        selectedBundles,
        questionsPerLevel * 3
      );
      const levels = splitIntoLevels(allQs, 3);

      setState({
        status: "playing",
        currentLevel: 0,
        currentQuestionIndex: 0,
        questions: levels,
        currentQuestion: levels[0]?.[0] || null,
        timeLeft: TIMER_SECONDS,
        score: 0,
        totalQuestions: allQs.length,
        answers: [],
      });

      setSelectedAnswer(null);
      setShowResult(false);
      setIsAnswered(false);
      startTimer();
    },
    [startTimer]
  );

  const submitAnswer = useCallback(
    (answer: string) => {
      if (isAnswered || !state.currentQuestion) return;

      clearTimer();
      setIsAnswered(true);
      setSelectedAnswer(answer);
      setShowResult(true);

      const correct = checkAnswer(
        state.currentQuestion.type,
        state.currentQuestion.data,
        answer
      );

      setState((prev) => ({
        ...prev,
        score: correct ? prev.score + SCORE_PER_CORRECT : prev.score,
        answers: [
          ...prev.answers,
          {
            questionIndex:
              prev.currentLevel * 10 + prev.currentQuestionIndex,
            correct,
            answer,
          },
        ],
      }));
    },
    [isAnswered, state.currentQuestion, clearTimer]
  );

  const nextQuestion = useCallback(() => {
    setState((prev) => {
      const currentLevelQs = prev.questions[prev.currentLevel] || [];
      const nextQIndex = prev.currentQuestionIndex + 1;

      if (nextQIndex < currentLevelQs.length) {
        setSelectedAnswer(null);
        setShowResult(false);
        setIsAnswered(false);
        return {
          ...prev,
          currentQuestionIndex: nextQIndex,
          currentQuestion: currentLevelQs[nextQIndex],
          timeLeft: TIMER_SECONDS,
        };
      }

      const nextLevel = prev.currentLevel + 1;
      if (nextLevel < prev.questions.length) {
        setSelectedAnswer(null);
        setShowResult(false);
        setIsAnswered(false);
        return {
          ...prev,
          status: "level-transition",
          currentLevel: nextLevel,
          currentQuestionIndex: 0,
          currentQuestion: prev.questions[nextLevel]?.[0] || null,
          timeLeft: TIMER_SECONDS,
        };
      }

      return { ...prev, status: "finished" };
    });
  }, []);

  const startNextLevel = useCallback(() => {
    setState((prev) => ({
      ...prev,
      status: "playing",
    }));
    setSelectedAnswer(null);
    setShowResult(false);
    setIsAnswered(false);
    startTimer();
  }, [startTimer]);

  const resetGame = useCallback(() => {
    clearTimer();
    setState({
      status: "setup",
      currentLevel: 0,
      currentQuestionIndex: 0,
      questions: [],
      currentQuestion: null,
      timeLeft: TIMER_SECONDS,
      score: 0,
      totalQuestions: 0,
      answers: [],
    });
    setSelectedAnswer(null);
    setShowResult(false);
    setIsAnswered(false);
  }, [clearTimer]);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return {
    ...state,
    selectedAnswer,
    showResult,
    isAnswered,
    timerMax: TIMER_SECONDS,
    scorePerCorrect: SCORE_PER_CORRECT,
    startGame,
    submitAnswer,
    nextQuestion,
    startNextLevel,
    resetGame,
  };
}
