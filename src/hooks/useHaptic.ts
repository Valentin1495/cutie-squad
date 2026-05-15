import { generateHapticFeedback } from "@apps-in-toss/web-framework";
import { useCallback } from "react";

type HapticType =
  | "tickWeak"
  | "tap"
  | "tickMedium"
  | "softMedium"
  | "basicWeak"
  | "basicMedium"
  | "success"
  | "error"
  | "wiggle"
  | "confetti";

export function useHaptic() {
  const haptic = useCallback((type: HapticType = "tap") => {
    generateHapticFeedback({ type }).catch(() => {
      // 브라우저 환경에서는 무시
    });
  }, []);

  return haptic;
}
