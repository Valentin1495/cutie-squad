import { colors } from "@toss/tds-colors";
import { Text } from "@toss/tds-mobile";
import { AnimatePresence, motion } from "framer-motion";

interface CheerToastProps {
  cheerToast: string | null;
  isLaunching: boolean;
}

export function CheerToast({ cheerToast, isLaunching }: CheerToastProps) {
  return (
    <AnimatePresence>
      {cheerToast != null && !isLaunching && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.92 }}
          animate={{ opacity: 1, y: [16, -4, 0], scale: [0.92, 1.02, 1] }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 24, delay: 0.08 }}
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 92,
            zIndex: 20,
            display: "flex",
            justifyContent: "center",
            padding: "0 24px",
            boxSizing: "border-box",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 420,
              borderRadius: 18,
              backgroundColor: colors.white,
              border: `1px solid ${colors.purple100}`,
              boxShadow: "0 14px 30px rgba(0,27,55,0.14)",
              padding: "12px 14px",
              textAlign: "center",
              pointerEvents: "none",
            }}
          >
            <Text typography="t6" fontWeight="bold" color={colors.purple900}>
              📌 {cheerToast}
            </Text>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
