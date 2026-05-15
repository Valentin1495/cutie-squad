import { colors } from "@toss/tds-colors";

export const MIN_GOALS = 3;
export const MAX_GOALS = 5;
export const MAX_GOAL_TEXT_LENGTH = 24;
export const CREW_COLORS = [
  colors.orange400,
  colors.blue300,
  colors.green400,
  colors.yellow400,
  colors.purple400,
];

export function withAlpha(hexColor: string, alpha: number) {
  const hex = hexColor.replace("#", "");
  const red = Number.parseInt(hex.slice(0, 2), 16);
  const green = Number.parseInt(hex.slice(2, 4), 16);
  const blue = Number.parseInt(hex.slice(4, 6), 16);
  return `rgba(${red},${green},${blue},${alpha})`;
}

export type AddPhase =
  | "idle"
  | "card-exit"
  | "crew-enter"
  | "aim"
  | "goal-land"
  | "celebrate"
  | "bubble-update";

export const ADD_PHASE_DURATIONS = {
  CARD_EXIT: 1500,
  CREW_ENTER: 900,
  GOAL_LAND: 360,
  CELEBRATE: 260,
} as const;

export const CREW_EMOJIS = ["🐱", "🐶", "🐹", "🐰", "🦊"];

export const EMOJI_OPTIONS = [
  "💧",
  "🚶",
  "📚",
  "🧘",
  "☀️",
  "✨",
  "💪",
  "📝",
  "🎧",
  "🧹",
  "🌙",
  "💤",
  "🍎",
  "🎯",
  "🍽️",
  "🌿",
  "🏃",
  "☕",
  "🪴",
  "🧡",
];

export type ConfettiCorner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export const STAGE_SPARKLES = [
  { left: "14%", top: "28%", size: 6, delay: 0 },
  { left: "78%", top: "24%", size: 5, delay: 0.1 },
  { left: "24%", top: "66%", size: 4, delay: 0.18 },
  { left: "68%", top: "70%", size: 6, delay: 0.28 },
  { left: "88%", top: "54%", size: 4, delay: 0.36 },
];

export const CONFETTI_PARTICLES: Array<{
  emoji: string;
  corner: ConfettiCorner;
  x: number;
  y: number;
  rotate: number;
}> = [
  { emoji: "🐱", corner: "top-left", x: -52, y: -86, rotate: 110 },
  { emoji: "🎯", corner: "top-left", x: 24, y: -112, rotate: 260 },
  { emoji: "✨", corner: "top-left", x: -8, y: -96, rotate: 180 },
  { emoji: "📌", corner: "top-right", x: 48, y: -92, rotate: 310 },
  { emoji: "🐶", corner: "top-right", x: -28, y: -118, rotate: 140 },
  { emoji: "✨", corner: "top-right", x: 10, y: -82, rotate: 240 },
  { emoji: "🐹", corner: "bottom-left", x: -44, y: -120, rotate: 220 },
  { emoji: "🎯", corner: "bottom-left", x: 36, y: -94, rotate: 90 },
  { emoji: "🐰", corner: "bottom-left", x: 4, y: -106, rotate: 360 },
  { emoji: "📌", corner: "bottom-right", x: 52, y: -116, rotate: 170 },
  { emoji: "🎯", corner: "bottom-right", x: -36, y: -88, rotate: 280 },
  { emoji: "🦊", corner: "bottom-right", x: 14, y: -104, rotate: 120 },
];

export const LAUNCH_BOARD_TEXT = "오늘의 응원단 출동!";

export const CHEER_LINES = [
  "목표 카드 접수 완료!",
  "좋아요, 크루가 바로 맡았어요.",
  "목표판에 단단히 붙였어요.",
  "이 목표는 오늘 해낼 수 있어요.",
  "기록 완료. 이제 응원은 크루에게 맡겨요.",
];
