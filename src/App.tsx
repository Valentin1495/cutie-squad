import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { CelebrationPage } from "./pages/CelebrationPage";
import { MainPage } from "./pages/MainPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { useAppStore } from "./store/useAppStore";

function App() {
  const { hasOnboarded, isLoaded, loadFromStorage, showCelebration } = useAppStore();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  if (!isLoaded) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fbfaf7",
          color: "#9575CD",
          fontSize: 15,
          fontWeight: 800,
        }}
      >
        응원단 준비 중...
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {!hasOnboarded ? (
        <OnboardingPage key="onboarding" />
      ) : showCelebration ? (
        <motion.div
          key="celebration"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.25 }}
        >
          <CelebrationPage />
        </motion.div>
      ) : (
        <motion.div
          key="main"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <MainPage />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;
