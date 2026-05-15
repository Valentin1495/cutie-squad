import { Button } from "@toss/tds-mobile";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CharacterCard } from "../components/CharacterCard";
import { ConfettiOverlay } from "../components/ConfettiOverlay";
import { useHaptic } from "../hooks/useHaptic";
import { useAppStore } from "../store/useAppStore";

const CHEERING_ANIMALS = ["🐱", "🐶", "🐹", "🐰", "🦊", "🐸", "🦄", "🐼"];

interface AnimatedAnimalProps {
  emoji: string;
  index: number;
}

function AnimatedAnimal({ emoji, index }: AnimatedAnimalProps) {
  const x = ((index % 4) - 1.5) * 70;
  const delay = index * 0.08;

  return (
    <motion.div
      initial={{ scale: 0, y: 60, x }}
      animate={{ scale: 1, y: 0, x }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 10,
        delay,
      }}
      style={{ fontSize: 40, display: "inline-block" }}
    >
      <motion.span
        animate={{ rotate: [-10, 10, -10], y: [0, -6, 0] }}
        transition={{
          repeat: Infinity,
          duration: 0.8 + index * 0.1,
          delay: delay + 0.5,
          ease: "easeInOut",
        }}
        style={{ display: "block" }}
      >
        {emoji}
      </motion.span>
    </motion.div>
  );
}

export function CelebrationPage() {
  const haptic = useHaptic();
  const { clearNewCharacter, newCharacter, setShowCelebration } = useAppStore();
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    haptic("confetti");
    const timer = setTimeout(() => setShowNew(true), 800);
    return () => clearTimeout(timer);
  }, [haptic]);

  const handleReturn = () => {
    haptic("success");
    clearNewCharacter();
    setShowCelebration(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#faf8ff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "60px 24px 40px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <ConfettiOverlay active />

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <div style={{ fontSize: 64, marginBottom: 8 }}>🎊</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#191919", margin: "0 0 8px" }}>
          오늘 목표 완료!
        </h1>
        <p style={{ fontSize: 15, color: "#666", margin: "0 0 32px", lineHeight: 1.6 }}>
          응원단이 전부 일어나 박수 치고 있어요.
          <br />
          내일도 같은 목표로 다시 만나요.
        </p>
      </motion.div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 4,
          marginBottom: 32,
          maxWidth: 280,
        }}
      >
        {CHEERING_ANIMALS.map((emoji, index) => (
          <AnimatedAnimal key={emoji} emoji={emoji} index={index} />
        ))}
      </div>

      <AnimatePresence>
        {showNew && newCharacter && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 250, damping: 18 }}
            style={{
              width: "100%",
              maxWidth: 320,
              padding: "20px",
              borderRadius: 20,
              backgroundColor: "#fff",
              border: "2px solid rgba(149,117,205,0.4)",
              marginBottom: 32,
              boxShadow: "0 8px 32px rgba(149,117,205,0.15)",
            }}
          >
            <p
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#9575CD",
                marginBottom: 12,
                letterSpacing: 0.5,
              }}
            >
              새 응원단원 합류!
            </p>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <CharacterCard character={newCharacter} unlocked isNew />
            </div>
            <p style={{ fontSize: 13, color: "#666", margin: "12px 0 0" }}>
              내일부터 같이 응원할 준비를 마쳤어요.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {!newCharacter && showNew && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            padding: "16px 20px",
            borderRadius: 16,
            backgroundColor: "rgba(149,117,205,0.08)",
            marginBottom: 32,
            maxWidth: 320,
            width: "100%",
          }}
        >
          <p style={{ fontSize: 14, color: "#555", margin: 0, lineHeight: 1.6 }}>
            목표를 더 많이 달성하면
            <br />
            새로운 응원단원이 찾아와요.
          </p>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        style={{ width: "100%", maxWidth: 320 }}
      >
        <Button onClick={handleReturn} style={{ width: "100%" }}>
          응원판으로 돌아가기
        </Button>
      </motion.div>
    </div>
  );
}
