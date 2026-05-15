import { AnimatePresence, motion } from "framer-motion";
import { CONFETTI_PARTICLES } from "./constants";
import { getConfettiPosition } from "./utils";

interface ConfettiBurstProps {
  burstKey: number;
  show: boolean;
  shouldReduceMotion: boolean | null;
}

export function ConfettiBurst({ burstKey, show, shouldReduceMotion }: ConfettiBurstProps) {
  return (
    <AnimatePresence>
      {show && !shouldReduceMotion && (
        <motion.div
          key={`confetti-${burstKey}`}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0 }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.04,
              },
            },
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 30,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          {CONFETTI_PARTICLES.map((particle, index) => (
            <motion.span
              key={`${particle.corner}-${index}`}
              variants={{
                hidden: { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 },
                visible: {
                  opacity: 0,
                  x: particle.x,
                  y: particle.y,
                  rotate: particle.rotate,
                  scale: [1, 1.22, 0.72],
                },
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{
                position: "absolute",
                ...getConfettiPosition(particle.corner),
                fontSize: index % 3 === 0 ? 22 : 19,
                lineHeight: 1,
                willChange: "transform, opacity",
              }}
            >
              {particle.emoji}
            </motion.span>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
