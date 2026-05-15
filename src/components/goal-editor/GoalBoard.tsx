import { colors } from "@toss/tds-colors";
import { Button, Text, useBottomSheet } from "@toss/tds-mobile";
import { AnimatePresence, motion } from "framer-motion";
import { forwardRef } from "react";
import type { GoalInput } from "../../store/useAppStore";
import {
  ADD_PHASE_DURATIONS,
  CREW_COLORS,
  CREW_EMOJIS,
  MAX_GOAL_TEXT_LENGTH,
  withAlpha,
} from "./constants";
import { EmojiPalette } from "./EmojiPalette";
import type { VisualCrewSlot } from "./GoalStage";
import { getRandomCheerLine, type LocalGoalInput } from "./utils";

interface GoalBoardProps {
  goals: LocalGoalInput[];
  crewSlots: VisualCrewSlot[];
  isFlowActive: boolean;
  isImpacting: boolean;
  isBoardLocked: boolean;
  isLaunching: boolean;
  isOnboarding: boolean;
  landedClientId: string | null;
  onRemoveGoal: (index: number) => void;
  onUpdateGoal: (index: number, patch: Partial<GoalInput>) => void;
}

export const GoalBoard = forwardRef<HTMLElement, GoalBoardProps>(function GoalBoard(
  {
    goals,
    crewSlots,
    isFlowActive,
    isImpacting,
    isBoardLocked,
    isLaunching,
    isOnboarding,
    landedClientId,
    onRemoveGoal,
    onUpdateGoal,
  },
  ref,
) {
  const { open: openBottomSheet, close: closeBottomSheet } = useBottomSheet();

  const openEmojiPalette = (index: number, emoji: string) => {
    if (isLaunching || isBoardLocked) return;

    openBottomSheet({
      header: (
        <div
          style={{
            textAlign: "center",
            color: colors.grey900,
            fontSize: 20,
            fontWeight: 800,
            lineHeight: 1.35,
            padding: "0 24px",
          }}
        >
          목표 이모지 선택
        </div>
      ),
      children: (
        <EmojiPalette
          selectedEmoji={emoji}
          onSelectEmoji={(nextEmoji) => {
            onUpdateGoal(index, { emoji: nextEmoji });
            closeBottomSheet();
          }}
        />
      ),
      onClose: closeBottomSheet,
    });
  };

  return (
    <motion.section
      ref={ref}
      animate={isFlowActive && !isLaunching ? { scale: 1.01, y: -2 } : { scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      style={{ transformOrigin: "50% 0%" }}
    >
      <Text
        typography="t5"
        fontWeight="bold"
        color={colors.grey800}
        display="block"
        style={{ margin: "0 0 10px" }}
      >
        오늘의 목표판
      </Text>
      <motion.div
        layout
        animate={isLaunching ? { y: -8, scale: 0.96 } : { y: 0, scale: 1 }}
        style={{
          display: isLaunching ? "flex" : "block",
          gap: 8,
          transformOrigin: "50% 0%",
        }}
      >
        <AnimatePresence mode="popLayout">
          {goals.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                borderColor: isFlowActive ? withAlpha(colors.purple500, 0.58) : colors.grey300,
                backgroundColor: isFlowActive
                  ? withAlpha(colors.purple500, 0.08)
                  : withAlpha(colors.purple500, 0.04),
              }}
              exit={{ opacity: 0 }}
              style={{
                border: `1px dashed ${colors.grey300}`,
                borderRadius: 16,
                padding: "24px 16px",
                textAlign: "center",
                backgroundColor: withAlpha(colors.purple500, 0.04),
              }}
            >
              <Text typography="t6" color={colors.grey500}>
                추천 목표 카드를 골라 오늘의 목표를 모아보세요.
              </Text>
            </motion.div>
          ) : (
            goals.map((goal, index) => {
              const isJustLanded = goal._clientId === landedClientId;
              const crewSlot = crewSlots.find((slot) => slot.clientId === goal._clientId);
              const crewIndex = crewSlot?.crewIndex ?? index;
              const crewColor = CREW_COLORS[crewIndex % CREW_COLORS.length];
              const crewEmoji = crewSlot?.emoji ?? CREW_EMOJIS[crewIndex % CREW_EMOJIS.length];

              return (
                <motion.div
                  layout
                  key={goal._clientId}
                  initial={{
                    opacity: 0,
                    y: isJustLanded ? -72 : isOnboarding ? -34 : 20,
                    scale: isJustLanded ? 0.86 : isOnboarding ? 0.9 : 0.94,
                    rotate: isJustLanded
                      ? index % 2 === 0
                        ? -6
                        : 6
                      : index % 2 === 0
                        ? -3
                        : 3,
                  }}
                  animate={{
                    opacity: 1,
                    scale: isJustLanded ? [0.82, 1.08, 0.96, 1.01, 1] : 1,
                    rotate: isJustLanded ? [index % 2 === 0 ? -6 : 6, 2, -1, 0] : 0,
                    y: isJustLanded ? [20, -14, 5, -2, 0] : 0,
                    borderTopColor:
                      isJustLanded
                        ? withAlpha(colors.purple500, 0.56)
                        : isFlowActive
                            ? withAlpha(colors.purple500, 0.46)
                            : colors.grey200,
                    borderRightColor:
                      isJustLanded
                        ? withAlpha(colors.purple500, 0.56)
                        : isFlowActive
                            ? withAlpha(colors.purple500, 0.46)
                            : colors.grey200,
                    borderBottomColor:
                      isJustLanded
                        ? withAlpha(colors.purple500, 0.56)
                        : isFlowActive
                            ? withAlpha(colors.purple500, 0.46)
                            : colors.grey200,
                    borderLeftColor: crewColor,
                    boxShadow: isJustLanded
                      ? "0 14px 28px rgba(0,27,55,0.16)"
                      : isFlowActive
                          ? "0 12px 24px rgba(0,27,55,0.1)"
                          : "0 8px 18px rgba(0,27,55,0.06)",
                  }}
                  exit={{
                    opacity: 0,
                    x: 28,
                    y: -4,
                    scale: 0.82,
                    rotate: index % 2 === 0 ? 6 : -6,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: isJustLanded ? 460 : 360,
                    damping: isJustLanded ? 22 : 26,
                    duration: isJustLanded ? ADD_PHASE_DURATIONS.GOAL_LAND / 1000 : undefined,
                  }}
                  style={{
                    position: "relative",
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                    border: `1px solid ${colors.grey200}`,
                    borderLeftWidth: 4,
                    borderLeftStyle: "solid",
                    borderLeftColor: crewColor,
                    borderRadius: 16,
                    backgroundColor: colors.white,
                    padding: isLaunching ? "10px" : "10px 10px 10px 12px",
                    marginBottom: isLaunching ? 0 : 8,
                    minWidth: isLaunching ? 92 : undefined,
                    flex: isLaunching ? "1 1 0" : undefined,
                    overflow: "visible",
                  }}
                >
                  <AnimatePresence>
                    {isJustLanded && !isLaunching && (
                      <motion.div
                        key="goal-cheer-bubble"
                        initial={{ opacity: 0, y: 6, scale: 0.88 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.92 }}
                        transition={{ delay: 0.2, duration: 0.22 }}
                        style={{
                          position: "absolute",
                          top: -32,
                          left: 12,
                          zIndex: 3,
                          maxWidth: "calc(100% - 24px)",
                          border: `1px solid ${withAlpha(crewColor, 0.36)}`,
                          borderRadius: "12px 12px 12px 4px",
                          backgroundColor: colors.white,
                          boxShadow: "0 4px 12px rgba(0,27,55,0.12)",
                          padding: "4px 10px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          pointerEvents: "none",
                        }}
                      >
                        <Text typography="t7" fontWeight="bold" color={crewColor}>
                          {getRandomCheerLine(goal.text, goals.length)}
                        </Text>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <AnimatePresence>
                    {isJustLanded && !isLaunching && isImpacting && (
                      <motion.span
                        key="impact-ring"
                        initial={{ opacity: 0.9, scale: 0.5 }}
                        animate={{ opacity: 0, scale: 2.4 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.38, ease: "easeOut" }}
                        style={{
                          position: "absolute",
                          inset: -4,
                          borderRadius: 20,
                          border: `2px solid ${withAlpha(crewColor, 0.58)}`,
                          pointerEvents: "none",
                          zIndex: 0,
                        }}
                      />
                    )}
                  </AnimatePresence>
                  <AnimatePresence>
                    {isJustLanded && !isLaunching && (
                      <motion.div
                        key="goal-stamp"
                        initial={{ opacity: 0, scale: 1.4, rotate: -12 }}
                        animate={{ opacity: [0, 1, 0.92], scale: [1.4, 0.92, 1], rotate: -8 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ delay: 0.08, duration: 0.34, ease: "easeOut" }}
                        style={{
                          position: "absolute",
                          right: 12,
                          top: -10,
                          zIndex: 4,
                          border: `2px solid ${withAlpha(crewColor, 0.72)}`,
                          borderRadius: 999,
                          backgroundColor: colors.white,
                          color: crewColor,
                          fontSize: 11,
                          fontWeight: 900,
                          padding: "4px 8px",
                          boxShadow: "0 6px 14px rgba(0,27,55,0.12)",
                          pointerEvents: "none",
                        }}
                      >
                        접수 완료
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <AnimatePresence>
                    {isJustLanded && (
                      <motion.span
                        key="goal-shine"
                        initial={{ opacity: 0, x: "-120%" }}
                        animate={{ opacity: [0, 0.75, 0], x: "120%" }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.58, ease: "easeOut" }}
                        style={{
                          position: "absolute",
                          inset: 0,
                          width: "56%",
                          background:
                            "linear-gradient(100deg, transparent, rgba(255,255,255,0.86), transparent)",
                          pointerEvents: "none",
                        }}
                      />
                    )}
                  </AnimatePresence>
                  <div style={{ position: "relative", zIndex: 2, flex: "0 0 auto" }}>
                    <motion.button
                      type="button"
                      disabled={isLaunching || isBoardLocked}
                      initial={{ scale: 0, y: 12 }}
                      animate={{
                        scale: isJustLanded ? [1, 1.22, 0.94, 1] : 1,
                        y: isJustLanded ? [-6, 4, -2, 0] : 0,
                        rotate: isJustLanded ? [0, -8, 6, 0] : 0,
                      }}
                      whileTap={isLaunching || isBoardLocked ? undefined : { scale: 0.92 }}
                      transition={{
                        type: "spring",
                        stiffness: isJustLanded ? 460 : 300,
                        damping: isJustLanded ? 18 : 22,
                      }}
                      onClick={() => openEmojiPalette(index, goal.emoji)}
                      style={{
                        width: 34,
                        height: 34,
                        border: "none",
                        borderRadius: 12,
                        backgroundColor: withAlpha(crewColor, 0.1),
                        color: colors.grey900,
                        fontSize: 24,
                        lineHeight: 1,
                        padding: 0,
                        cursor: isLaunching || isBoardLocked ? "default" : "pointer",
                      }}
                      aria-label="목표 이모지 선택"
                    >
                      {goal.emoji}
                    </motion.button>
                  </div>
                  <input
                    value={goal.text}
                    readOnly={isLaunching || isBoardLocked}
                    maxLength={MAX_GOAL_TEXT_LENGTH}
                    onChange={(event) => onUpdateGoal(index, { text: event.target.value })}
                    style={{
                      minWidth: 0,
                      flex: 1,
                      border: "none",
                      outline: "none",
                      color: colors.grey800,
                      fontWeight: 700,
                      backgroundColor: "transparent",
                      textOverflow: "ellipsis",
                      position: "relative",
                      zIndex: 1,
                    }}
                  />
                  {!isLaunching && !isBoardLocked && (
                    <span
                      style={{
                        position: "relative",
                        zIndex: 1,
                        flex: "0 0 auto",
                        borderRadius: 999,
                        backgroundColor: withAlpha(crewColor, 0.1),
                        color: crewColor,
                        fontSize: 11,
                        fontWeight: 900,
                        padding: "5px 7px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {crewEmoji} 담당
                    </span>
                  )}
                  {!isLaunching && !isBoardLocked && (
                    <>
                      <Button
                        type="button"
                        size="small"
                        variant="weak"
                        color="danger"
                        onClick={() => {
                          onRemoveGoal(index);
                        }}
                        style={{
                          width: 34,
                          minWidth: 34,
                          height: 34,
                          padding: 0,
                          zIndex: 1,
                        }}
                        aria-label="목표 삭제"
                      >
                        ×
                      </Button>
                    </>
                  )}
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </motion.div>
      {isLaunching && (
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: [18, 0, -4, 0], scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            marginTop: 14,
            borderRadius: 18,
            backgroundColor: colors.purple500,
            padding: "16px",
            textAlign: "center",
            fontWeight: 900,
          }}
        >
          <Text typography="t5" fontWeight="bold" color={colors.white}>
            오늘의 목표판을 들고 출동해요!
          </Text>
        </motion.div>
      )}
    </motion.section>
  );
});
