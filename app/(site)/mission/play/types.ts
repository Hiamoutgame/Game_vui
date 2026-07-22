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

export const VICTORY_LEVEL = 20;
export const MAX_PER_GAME_SCORE = 20;

export interface GameState {
  totalScore: number;
  totalFails: number;
  currentLevel: number;
  isPlaying: boolean;
  victory: boolean;
  gameStartTime: number | null;
  gameScores: GameScores;
  gameFailures: GameFailures;
  activeGames: GameId[];
}

export interface DemoData {
  gameId: GameId;
  title: string;
  icon: string;
  slides: { icon: string; text: string }[];
}
