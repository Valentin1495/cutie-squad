import { colors } from "@toss/tds-colors";
import { motion } from "framer-motion";
import { EMOJI_OPTIONS, withAlpha } from "./constants";

interface EmojiPaletteProps {
  selectedEmoji: string;
  onSelectEmoji: (emoji: string) => void;
}

export function EmojiPalette({ selectedEmoji, onSelectEmoji }: EmojiPaletteProps) {
  return (
    <div
      style={{
        padding: "2px 24px 24px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 44px)",
          gap: 10,
          justifyContent: "center",
        }}
      >
        {EMOJI_OPTIONS.map((emoji) => (
          <motion.button
            key={emoji}
            type="button"
            whileTap={{ scale: 0.92 }}
            aria-label={`${emoji} 목표 이모지 선택`}
            onClick={() => onSelectEmoji(emoji)}
            style={{
              width: 44,
              height: 44,
              borderRadius: 9,
              border:
                selectedEmoji === emoji
                  ? `2px solid ${withAlpha(colors.purple500, 0.78)}`
                  : `1px solid ${colors.grey200}`,
              backgroundColor:
                selectedEmoji === emoji ? withAlpha(colors.purple500, 0.08) : colors.grey50,
              fontSize: 22,
              lineHeight: 1,
              padding: 0,
            }}
          >
            {emoji}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
