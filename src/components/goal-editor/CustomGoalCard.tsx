import { colors } from "@toss/tds-colors";
import { Badge, Button, Text } from "@toss/tds-mobile";
import { motion } from "framer-motion";
import { useRef } from "react";
import { EMOJI_OPTIONS, MAX_GOAL_TEXT_LENGTH, withAlpha, type AddPhase } from "./constants";

interface CustomGoalCardProps {
  addPhase: AddPhase;
  canAddCustom: boolean;
  customEmoji: string;
  customText: string;
  isChainActive: boolean;
  isCustomLaunching: boolean;
  isDuplicateCustom: boolean;
  isLaunching: boolean;
  nextCrewEmoji: string;
  nextCrewColor: string;
  onAddCustomGoal: (
    sourceElement: HTMLElement | null,
    emojiElement: HTMLElement | null,
  ) => void;
  setCustomEmoji: (emoji: string) => void;
  setCustomText: (text: string) => void;
  trimmedCustomTextLength: number;
}

export function CustomGoalCard({
  addPhase,
  canAddCustom,
  customEmoji,
  customText,
  isChainActive,
  isCustomLaunching,
  isDuplicateCustom,
  isLaunching,
  nextCrewEmoji,
  nextCrewColor,
  onAddCustomGoal,
  setCustomEmoji,
  setCustomText,
  trimmedCustomTextLength,
}: CustomGoalCardProps) {
  const sourceRef = useRef<HTMLDivElement | null>(null);
  const selectedEmojiRef = useRef<HTMLButtonElement | null>(null);

  const submitCustomGoal = () => {
    onAddCustomGoal(sourceRef.current, selectedEmojiRef.current ?? sourceRef.current);
  };

  return (
    <motion.section
      animate={
        isLaunching
          ? { opacity: 0.18, y: -8, scale: 0.98 }
          : isChainActive
            ? { opacity: 0.72, y: -4, scale: 0.995 }
            : { opacity: 1, y: 0, scale: 1 }
      }
      style={{
        marginBottom: 16,
        perspective: 900,
        pointerEvents: isLaunching || isChainActive ? "none" : "auto",
      }}
    >
      <motion.div
        ref={sourceRef}
        initial={{ opacity: 0, y: 8, scale: 0.99 }}
        animate={
          isCustomLaunching
            ? { opacity: [1, 0.86, 0.3], y: -8, scale: [1, 1.03, 0.98] }
            : { opacity: 1, y: 0, scale: 1 }
        }
        transition={{ delay: isCustomLaunching ? 0 : 0.14, duration: 0.2, ease: "easeOut" }}
        style={{
          position: "relative",
          border: isCustomLaunching
            ? `2px solid ${nextCrewColor}`
            : `1px solid ${colors.grey200}`,
          borderLeft: `4px solid ${nextCrewColor}`,
          borderRadius: 16,
          background: isCustomLaunching
            ? `linear-gradient(135deg, ${colors.white} 0%, #f4f8ff 100%)`
            : colors.white,
          boxShadow: isCustomLaunching
            ? "0 18px 34px rgba(0,27,55,0.16)"
            : "0 8px 18px rgba(0,27,55,0.06)",
          padding: 14,
          overflow: "hidden",
        }}
      >
        {isCustomLaunching && (
          <span style={{ position: "absolute", right: 12, top: 12, zIndex: 2 }}>
            <Badge size="xsmall" color="blue" variant="fill">
              전달 중
            </Badge>
          </span>
        )}
        <Text
          typography="t5"
          fontWeight="bold"
          color={colors.grey800}
          display="block"
          style={{ margin: "0 0 4px" }}
        >
          내가 쓰는 목표 카드
        </Text>
        <Text typography="t7" color={colors.grey600} display="block" style={{ margin: "0 0 8px" }}>
          작성한 카드는 다음 크루 {nextCrewEmoji}에게 바로 전달돼요.
        </Text>
        <Text typography="t7" fontWeight="bold" color={nextCrewColor} display="block" style={{ marginBottom: 12 }}>
          담당 예정 {nextCrewEmoji}
        </Text>
        <div style={{ display: "flex", gap: 8, marginBottom: 12, overflowX: "auto", paddingBottom: 2 }}>
          {EMOJI_OPTIONS.map((emoji) => (
            <button
              ref={(element) => {
                if (customEmoji === emoji) {
                  selectedEmojiRef.current = element;
                }
              }}
              key={emoji}
              type="button"
              aria-label={`${emoji} 목표 이모지 선택`}
              onClick={() => setCustomEmoji(emoji)}
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                border:
                  customEmoji === emoji
                    ? `2px solid ${withAlpha(colors.purple500, 0.78)}`
                    : `1px solid ${colors.grey200}`,
                backgroundColor:
                  customEmoji === emoji ? withAlpha(colors.purple500, 0.08) : colors.grey50,
                fontSize: 20,
                lineHeight: 1,
                flex: "0 0 auto",
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <input
              value={customText}
              disabled={isChainActive}
              onChange={(event) =>
                setCustomText(event.target.value.slice(0, MAX_GOAL_TEXT_LENGTH))
              }
              onKeyDown={(event) => {
                if (event.key === "Enter" && addPhase === "idle") submitCustomGoal();
              }}
              placeholder="예: 물 마시기"
              style={{
                width: "100%",
                height: 40,
                borderRadius: 10,
                border: `1px solid ${colors.grey300}`,
                padding: "0 12px",
                opacity: isChainActive ? 0.5 : 1,
                boxSizing: "border-box",
              }}
            />
          </div>
          <Button
            size="medium"
            disabled={!canAddCustom || isLaunching || isChainActive}
            onClick={submitCustomGoal}
          >
            전달
          </Button>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 8,
            marginTop: 8,
          }}
        >
          {isDuplicateCustom ? (
            <Text typography="t7" color={colors.red500} display="block" style={{ margin: 0 }}>
              이미 목표판에 있는 목표예요.
            </Text>
          ) : (
            <Text typography="t7" color={colors.grey500} display="block" style={{ margin: 0 }}>
              짧게 적을수록 크루가 바로 이해해요.
            </Text>
          )}
          <Text typography="t7" color={colors.grey500}>
            {trimmedCustomTextLength}/{MAX_GOAL_TEXT_LENGTH}
          </Text>
        </div>
      </motion.div>
    </motion.section>
  );
}
