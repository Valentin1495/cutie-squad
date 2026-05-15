import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const EMOJIS = ["🎉", "🎊", "⭐", "🌟", "✨", "🐱", "🐶", "🐰", "💜", "🎈", "🍭", "🦄"];

interface Particle {
  id: number;
  emoji: string;
  x: number;
  delay: number;
  duration: number;
  size: number;
  rotate: number;
}

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

interface ConfettiOverlayProps {
  active: boolean;
}

export function ConfettiOverlay({ active }: ConfettiOverlayProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }

    const list: Particle[] = Array.from({ length: 24 }, (_, i) => ({
      id: i,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      x: randomBetween(5, 95),
      delay: randomBetween(0, 1.2),
      duration: randomBetween(2.5, 4.5),
      size: randomBetween(20, 36),
      rotate: randomBetween(-180, 180),
    }));
    setParticles(list);
  }, [active]);

  if (!active || particles.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 100,
        overflow: "hidden",
      }}
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -80, x: `${p.x}vw`, opacity: 1, rotate: 0 }}
          animate={{
            y: "110vh",
            opacity: [1, 1, 0.5, 0],
            rotate: p.rotate,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeIn",
            repeat: Infinity,
            repeatDelay: randomBetween(0.5, 2),
          }}
          style={{
            position: "absolute",
            fontSize: p.size,
            top: 0,
            left: 0,
          }}
        >
          {p.emoji}
        </motion.div>
      ))}
    </div>
  );
}
