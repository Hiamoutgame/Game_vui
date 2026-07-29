export type GameId = "km" | "ht" | "nc" | "px";

export const GAME_IDS: GameId[] = ["km", "ht", "nc", "px"];

export const GAME_NAMES: Record<GameId, string> = {
  km: "Ký ức phân mảnh",
  ht: "Hứng tác vụ rơi",
  nc: "Nhiễu màu-chữ",
  px: "Phản xạ ngược chiều",
};

export const GAME_ICONS: Record<GameId, string> = {
  km: "🧠",
  ht: "⚽",
  nc: "🎨",
  px: "⬆️",
};

export const GAME_NUMBERS: Record<GameId, string> = {
  km: "01",
  ht: "02",
  nc: "03",
  px: "04",
};

export type GameScores = Record<GameId, number>;
export type GameFailures = Record<GameId, number>;
export type GameLevels = Record<GameId, number>;
export type FailureKind = "mistake" | "miss";

export const VICTORY_LEVEL = 20;
export const MAX_PER_GAME_SCORE = 20;

/** Memory game (km) has fewer levels than the other three games. */
export const MEMORY_MAX_SCORE = 12;

export const GAME_MAX_SCORES: Record<GameId, number> = {
  km: MEMORY_MAX_SCORE,
  ht: MAX_PER_GAME_SCORE,
  nc: MAX_PER_GAME_SCORE,
  px: MAX_PER_GAME_SCORE,
};

export interface GameState {
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
  activeGames: GameId[];
}

export interface DemoData {
  gameId: GameId;
  title: string;
  icon: string;
  slides: { icon: string; text: string }[];
}
