"use client";

import { useState, useRef, useCallback } from "react";
import type { FailureKind, GameId, GameScores, GameFailures, GameLevels } from "./types";
import { VICTORY_LEVEL, MAX_PER_GAME_SCORE, GAME_MAX_SCORES } from "./types";
import { soundSystem } from "./sound-system";

export interface GameEngineState {
  totalScore: number;
  totalFails: number;
  totalMistakes: number;
  totalMisses: number;
  currentLevel: number;
  isPlaying: boolean;
  victory: boolean;
  gameStartTime: number | null;
  gameScores: GameScores;
  gameFailures: GameFailures;
  gameMistakes: GameFailures;
  gameMisses: GameFailures;
  gameLevels: GameLevels;
  activeGames: GameId[];
  completedGames: Set<GameId>;
}

export interface GameEngineActions {
  startGame: (games: GameId[], demoCap?: number) => void;
  addScore: (gameId: GameId) => void;
  penalizeGame: (gameId: GameId, failureKind: FailureKind) => void;
  checkGameComplete: (gameId: GameId) => boolean;
  setGameLevel: (gameId: GameId, level: number) => void;
  endGame: () => void;
  resetGameState: () => void;
  isGameComplete: (gameId: GameId) => boolean;
}

export function useGameEngine(): [GameEngineState, GameEngineActions] {
  const [state, setState] = useState<GameEngineState>({
    totalScore: 0,
    totalFails: 0,
    totalMistakes: 0,
    totalMisses: 0,
    currentLevel: 1,
    isPlaying: false,
    victory: false,
    gameStartTime: null,
    gameScores: { km: 0, ht: 0, nc: 0, px: 0 },
    gameFailures: { km: 0, ht: 0, nc: 0, px: 0 },
    gameMistakes: { km: 0, ht: 0, nc: 0, px: 0 },
    gameMisses: { km: 0, ht: 0, nc: 0, px: 0 },
    gameLevels: { km: 1, ht: 1, nc: 1, px: 1 },
    activeGames: [],
    completedGames: new Set<GameId>(),
  });

  const demoCapRef = useRef<number | null>(null);
  const penalizeTimeoutsRef = useRef<Map<GameId, ReturnType<typeof setTimeout>>>(new Map());

  const updateLevel = useCallback(
    (scores: GameScores, active: GameId[], currentLevel: number) => {
      const maxLvl = demoCapRef.current || VICTORY_LEVEL;
      const lowestActiveScore = active.length > 0 ? Math.min(...active.map((g) => scores[g] || 0)) : 0;
      const calculatedLevel = Math.min(maxLvl, lowestActiveScore + 1);
      const newLevel = Math.max(currentLevel, calculatedLevel);
      if (newLevel > currentLevel) {
        soundSystem.levelUp();
      }
      return newLevel;
    },
    []
  );

  const startGame = useCallback(
    (games: GameId[], demoCap?: number) => {
      demoCapRef.current = demoCap ?? null;
      const initialScores: GameScores = { km: 0, ht: 0, nc: 0, px: 0 };
      const initialFailures: GameFailures = { km: 0, ht: 0, nc: 0, px: 0 };
      setState({
        totalScore: 0,
        totalFails: 0,
        totalMistakes: 0,
        totalMisses: 0,
        currentLevel: 1,
        isPlaying: true,
        victory: false,
        gameStartTime: Date.now(),
        gameScores: initialScores,
        gameFailures: initialFailures,
        gameMistakes: initialFailures,
        gameMisses: initialFailures,
        gameLevels: { km: 1, ht: 1, nc: 1, px: 1 },
        activeGames: games,
        completedGames: new Set<GameId>(),
      });
    },
    []
  );

  const addScore = useCallback(
    (gameId: GameId) => {
      setState((prev) => {
        if (!prev.isPlaying || prev.victory) return prev;
        if ((prev.gameScores[gameId] || 0) >= (GAME_MAX_SCORES[gameId] || MAX_PER_GAME_SCORE)) return prev;

        const newScores = { ...prev.gameScores, [gameId]: (prev.gameScores[gameId] || 0) + 1 };
        const newTotal = prev.totalScore + 1;
        const newLevel = updateLevel(newScores, prev.activeGames, prev.currentLevel);
        return {
          ...prev,
          totalScore: newTotal,
          gameScores: newScores,
          currentLevel: newLevel,
        };
      });
    },
    [updateLevel]
  );

  const penalizeGame = useCallback(
    (gameId: GameId, failureKind: FailureKind) => {
      soundSystem.wrong();
      setState((prev) => {
        if (!prev.isPlaying || prev.victory) return prev;

        const newFails = { ...prev.gameFailures, [gameId]: (prev.gameFailures[gameId] || 0) + 1 };
        const newMistakes =
          failureKind === "mistake"
            ? { ...prev.gameMistakes, [gameId]: (prev.gameMistakes[gameId] || 0) + 1 }
            : prev.gameMistakes;
        const newMisses =
          failureKind === "miss"
            ? { ...prev.gameMisses, [gameId]: (prev.gameMisses[gameId] || 0) + 1 }
            : prev.gameMisses;

        return {
          ...prev,
          totalFails: prev.totalFails + 1,
          totalMistakes: prev.totalMistakes + (failureKind === "mistake" ? 1 : 0),
          totalMisses: prev.totalMisses + (failureKind === "miss" ? 1 : 0),
          gameFailures: newFails,
          gameMistakes: newMistakes,
          gameMisses: newMisses,
        };
      });
    },
    []
  );

  const endGame = useCallback(() => {
    setState((prev) => ({ ...prev, isPlaying: false }));
  }, []);

  const resetGameState = useCallback(() => {
    penalizeTimeoutsRef.current.forEach((t) => clearTimeout(t));
    penalizeTimeoutsRef.current.clear();
    setState({
      totalScore: 0,
      totalFails: 0,
      totalMistakes: 0,
      totalMisses: 0,
      currentLevel: 1,
      isPlaying: false,
      victory: false,
      gameStartTime: null,
      gameScores: { km: 0, ht: 0, nc: 0, px: 0 },
      gameFailures: { km: 0, ht: 0, nc: 0, px: 0 },
      gameMistakes: { km: 0, ht: 0, nc: 0, px: 0 },
      gameMisses: { km: 0, ht: 0, nc: 0, px: 0 },
      gameLevels: { km: 1, ht: 1, nc: 1, px: 1 },
      activeGames: [],
      completedGames: new Set<GameId>(),
    });
  }, []);

  const isGameComplete = useCallback(
    (gameId: GameId) => {
      return state.completedGames.has(gameId);
    },
    [state.completedGames]
  );

  const setGameLevel = useCallback(
    (gameId: GameId, level: number) => {
      setState((prev) => {
        if ((prev.gameLevels[gameId] || 1) >= level) return prev;
        return {
          ...prev,
          gameLevels: { ...prev.gameLevels, [gameId]: level },
        };
      });
    },
    []
  );

  const checkGameComplete = useCallback(
    (gameId: GameId) => {
      return state.completedGames.has(gameId);
    },
    [state.completedGames]
  );

  const actions: GameEngineActions = {
    startGame,
    addScore,
    penalizeGame,
    setGameLevel,
    checkGameComplete,
    endGame,
    resetGameState,
    isGameComplete,
  };

  return [state, actions];
}
