import { colors } from "@toss/tds-colors";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { ADD_PHASE_DURATIONS, type AddPhase, withAlpha } from "./constants";

export interface FlowRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface PendingVisualGoal {
  emojiRect: FlowRect;
  emoji: string;
  sourceRect: FlowRect;
  text: string;
  targetCrewIndex: number;
  crewEmoji: string;
  crewColor: string;
}

interface FlowTrailProps {
  addPhase: AddPhase;
  enteringCrewIndex: number | null;
  onEmojiArrive: () => void;
  onCardArrive: () => void;
  pendingVisualGoal: PendingVisualGoal | null;
  shouldReduceMotion: boolean;
  stageRect: FlowRect | null;
}

const FULL_CARD_WIDTH = 168;
const VIEWPORT_GUTTER = 16;
const CARD_HEIGHT = 54;
const CREW_SLOT_WIDTH = 48;
const CREW_SLOT_GAP = 8;
const CREW_SLOT_COUNT = 5;

function centerOf(rect: FlowRect) {
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

function clampCardLeftFromCenter(centerX: number, cardWidth: number) {
  const left = centerX - cardWidth / 2;
  if (typeof window === "undefined") return left;

  return Math.min(
    window.innerWidth - cardWidth - VIEWPORT_GUTTER,
    Math.max(VIEWPORT_GUTTER, left),
  );
}

function TravelingMissionCard({
  mission,
  label,
}: {
  mission: PendingVisualGoal;
  label: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        width: 168,
        maxWidth: 168,
        boxSizing: "border-box",
        borderRadius: 14,
        border: `1px solid ${withAlpha(mission.crewColor, 0.42)}`,
        borderLeft: `4px solid ${mission.crewColor}`,
        backgroundColor: colors.white,
        boxShadow: "0 14px 28px rgba(0,27,55,0.18)",
        padding: "9px 10px",
      }}
    >
      <span style={{ fontSize: 23, lineHeight: 1 }}>{mission.emoji}</span>
      <span style={{ minWidth: 0, flex: 1 }}>
        <span
          style={{
            display: "block",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            color: colors.grey900,
            fontSize: 12,
            fontWeight: 900,
          }}
        >
          {mission.text}
        </span>
        <span
          style={{
            display: "block",
            marginTop: 2,
            color: mission.crewColor,
            fontSize: 10,
            fontWeight: 900,
          }}
        >
          {mission.crewEmoji} {label}
        </span>
      </span>
    </div>
  );
}

export function FlowTrail({
  addPhase,
  enteringCrewIndex,
  onEmojiArrive,
  onCardArrive,
  pendingVisualGoal,
  shouldReduceMotion,
  stageRect,
}: FlowTrailProps) {
  useEffect(() => {
    if (addPhase !== "aim" || pendingVisualGoal == null) return;

    const timeoutId = window.setTimeout(onCardArrive, shouldReduceMotion ? 240 : 950);
    return () => window.clearTimeout(timeoutId);
  }, [addPhase, onCardArrive, pendingVisualGoal, shouldReduceMotion]);

  if (pendingVisualGoal == null) return null;

  const rawSourceCenter = centerOf(pendingVisualGoal.sourceRect);
  const fullCardSafeWidth = FULL_CARD_WIDTH * 1.1;
  const source = {
    x: clampCardLeftFromCenter(rawSourceCenter.x, fullCardSafeWidth),
    y: rawSourceCenter.y - CARD_HEIGHT / 2,
  };
  const stageFallback = {
    x: clampCardLeftFromCenter(rawSourceCenter.x, fullCardSafeWidth),
    y: source.y + 120,
  };
  const targetCrewIndex = pendingVisualGoal.targetCrewIndex ?? enteringCrewIndex ?? 2;
  const crewTrackWidth =
    CREW_SLOT_COUNT * CREW_SLOT_WIDTH + (CREW_SLOT_COUNT - 1) * CREW_SLOT_GAP;
  const crewSlotCenterOffset =
    CREW_SLOT_WIDTH / 2 + targetCrewIndex * (CREW_SLOT_WIDTH + CREW_SLOT_GAP);
  const stageTarget =
    stageRect == null
      ? stageFallback
      : {
          x: clampCardLeftFromCenter(
            stageRect.left + stageRect.width / 2 - crewTrackWidth / 2 + crewSlotCenterOffset,
            fullCardSafeWidth,
          ),
          y: stageRect.top + stageRect.height * 0.68 - CARD_HEIGHT / 2,
        };
  const arcX = source.x + (stageTarget.x - source.x) * 0.42 - 20;
  const arcY = Math.min(source.y, stageTarget.y) - 64;

  return (
    <AnimatePresence>
      {addPhase === "card-exit" && (
        <motion.div
          key={`trail-1-${pendingVisualGoal.text}`}
          initial={{
            x: source.x,
            y: source.y,
            opacity: shouldReduceMotion ? 0 : 1,
            scale: 0.92,
            rotate: 0,
          }}
          animate={{
            x: shouldReduceMotion
              ? stageTarget.x
              : [source.x, source.x, source.x, arcX, stageTarget.x],
            y: shouldReduceMotion
              ? stageTarget.y
              : [source.y, source.y - 8, source.y - 8, arcY, stageTarget.y],
            opacity: shouldReduceMotion ? [0, 1, 0] : [1, 1, 1, 1, 0],
            scale: shouldReduceMotion ? [0.9, 1.04, 0.82] : [0.92, 1.08, 1.08, 1.04, 0.82],
            rotate: shouldReduceMotion ? 0 : [0, 0, 0, -8, 0],
          }}
          exit={{ opacity: 0, scale: 0.84 }}
          transition={{
            duration: shouldReduceMotion ? 0.24 : ADD_PHASE_DURATIONS.CARD_EXIT / 1000,
            ease: "easeInOut",
            times: shouldReduceMotion ? undefined : [0, 0.18, 0.58, 0.8, 1],
          }}
          onAnimationComplete={onEmojiArrive}
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            zIndex: 50,
            pointerEvents: "none",
            willChange: "transform, opacity",
          }}
        >
          <TravelingMissionCard mission={pendingVisualGoal} label={"\uC5D0\uAC8C \uC804\uB2EC"} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
