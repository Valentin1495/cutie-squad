import { Checkbox } from "@toss/tds-mobile";
import { motion } from "framer-motion";
import { useHaptic } from "../hooks/useHaptic";
import type { Goal } from "../store/useAppStore";

interface GoalItemProps {
  goal: Goal;
  onToggle: (id: string) => void;
}

export function GoalItem({ goal, onToggle }: GoalItemProps) {
  const haptic = useHaptic();

  const handleChange = () => {
    if (goal.done) return;
    haptic("basicMedium");
    onToggle(goal.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileTap={goal.done ? {} : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onClick={handleChange}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "16px 20px",
        borderRadius: 16,
        backgroundColor: goal.done ? "rgba(149, 117, 205, 0.08)" : "#ffffff",
        border: `1.5px solid ${goal.done ? "rgba(149, 117, 205, 0.3)" : "#f0f0f0"}`,
        cursor: goal.done ? "default" : "pointer",
        transition: "background-color 0.2s, border-color 0.2s",
        userSelect: "none",
      }}
    >
      <Checkbox.Circle checked={goal.done} onCheckedChange={handleChange} size={24} />
      <span style={{ fontSize: 20 }}>{goal.emoji}</span>
      <span
        style={{
          flex: 1,
          fontSize: 15,
          fontWeight: 500,
          color: goal.done ? "#9575CD" : "#191919",
          textDecoration: goal.done ? "line-through" : "none",
          textDecorationColor: "rgba(149, 117, 205, 0.5)",
          transition: "color 0.2s",
        }}
      >
        {goal.text}
      </span>
      {goal.done && (
        <motion.span
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
          style={{ fontSize: 18, color: "#9575CD", fontWeight: 900 }}
        >
          ✓
        </motion.span>
      )}
    </motion.div>
  );
}
