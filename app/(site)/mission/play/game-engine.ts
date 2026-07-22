"use client";

import { useState, useRef, useCallback } from "react";
import type { GameId, GameScores, GameFailures } from "./types";
import { VICTORY_LEVEL, MAX_PER_GAME_SCORE } from "./types";
import { soundSystem } from "./sound-system";

export interface GameEngineState {
  totalScore: number;
  totalFails: number;
  currentLevel: number;
  isPlaying: boolean;
  victory: boolean;
  gameStartTime: number | null;
  gameScores: GameScores;
  gameFailures: GameFailures;
  activeGames: GameId[];
  completedGames: Set<GameId>;
}

export interface GameEngineActions {
  startGame: (games: GameId[], demoCap?: number) => void;
  addScore: (gameId: GameId) => void;
  penalizeGame: (gameId: GameId) => void;
  checkGameComplete: (gameId: GameId) => boolean;
  endGame: () => void;
  resetGameState: () => void;
  isGameComplete: (gameId: GameId) => boolean;
}

export function useGameEngine(): [GameEngineState, GameEngineActions] {
  const [state, setState] = useState<GameEngineState>({
    totalScore: 0,
    totalFails: 0,
    currentLevel: 1,
    isPlaying: false,
    victory: false,
    gameStartTime: null,
    gameScores: { km: 0, ht: 0, nc: 0, px: 0 },
    gameFailures: { km: 0, ht: 0, nc: 0, px: 0 },
    activeGames: [],
    completedGames: new Set<GameId>(),
  });

  const demoCapRef = useRef<number | null>(null);
  const penalizeTimeoutsRef = useRef<Map<GameId, ReturnType<typeof setTimeout>>>(new Map());

  const updateLevel = useCallback(
    (totalScore: number, activeCount: number, currentLevel: number) => {
      const maxLvl = demoCapRef.current || VICTORY_LEVEL;
      const newLevel = Math.min(maxLvl, Math.floor(totalScore / activeCount) + 1);
      if (newLevel > currentLevel) {
        soundSystem.levelUp();
      }
      return newLevel;
    },
    []
  );

  const checkVictory = useCallback(
    (level: number, scores: GameScores, active: GameId[]) => {
      if (level >= VICTORY_LEVEL && !demoCapRef.current) return true;
      const allMaxed = active.every((g) => (scores[g] || 0) >= MAX_PER_GAME_SCORE);
      return allMaxed;
    },
    []
  );

  const checkGameCompleteFn = useCallback(
    (gameId: GameId, scores: GameScores, completed: Set<GameId>) => {
      if ((scores[gameId] || 0) >= MAX_PER_GAME_SCORE) {
        completed.add(gameId);
        return true;
      }
      return false;
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
        currentLevel: 1,
        isPlaying: true,
        victory: false,
        gameStartTime: Date.now(),
        gameScores: initialScores,
        gameFailures: initialFailures,
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
        if ((prev.gameScores[gameId] || 0) >= MAX_PER_GAME_SCORE) return prev;

        const newScores = { ...prev.gameScores, [gameId]: (prev.gameScores[gameId] || 0) + 1 };
        const newTotal = prev.totalScore + 1;
        const newLevel = updateLevel(newTotal, prev.activeGames.length, prev.currentLevel);
        const newCompleted = new Set(prev.completedGames);
        checkGameCompleteFn(gameId, newScores, newCompleted);

        const didVictory = checkVictory(newLevel, newScores, prev.activeGames);
        if (didVictory) {
          soundSystem.levelUp();
        }

        return {
          ...prev,
          totalScore: newTotal,
          gameScores: newScores,
          currentLevel: newLevel,
          victory: didVictory || prev.victory,
          isPlaying: didVictory ? false : prev.isPlaying,
          completedGames: newCompleted,
        };
      });
    },
    [updateLevel, checkVictory, checkGameCompleteFn]
  );

  const penalizeGame = useCallback(
    (gameId: GameId) => {
      soundSystem.wrong();
      setState((prev) => {
        if (!prev.isPlaying || prev.victory) return prev;

        const currentGameScore = prev.gameScores[gameId] || 0;
        const newFails = { ...prev.gameFailures, [gameId]: (prev.gameFailures[gameId] || 0) + 1 };

        if (currentGameScore <= 0 && prev.totalScore <= 0) {
          return { ...prev, totalFails: prev.totalFails + 1, gameFailures: newFails };
        }

        const newScores = {
          ...prev.gameScores,
          [gameId]: Math.max(0, currentGameScore - 1),
        };
        const newTotal = Math.max(0, prev.totalScore - 1);
        const newLevel = updateLevel(newTotal, prev.activeGames.length, prev.currentLevel);

        return {
          ...prev,
          totalScore: newTotal,
          totalFails: prev.totalFails + 1,
          gameScores: newScores,
          gameFailures: newFails,
          currentLevel: newLevel,
        };
      });
    },
    [updateLevel]
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
      currentLevel: 1,
      isPlaying: false,
      victory: false,
      gameStartTime: null,
      gameScores: { km: 0, ht: 0, nc: 0, px: 0 },
      gameFailures: { km: 0, ht: 0, nc: 0, px: 0 },
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
    checkGameComplete,
    endGame,
    resetGameState,
    isGameComplete,
  };

  return [state, actions];
}
