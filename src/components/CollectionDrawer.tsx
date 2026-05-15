import { Button } from "@toss/tds-mobile";
import { AnimatePresence, motion } from "framer-motion";
import { ALL_CHARACTERS, type Character } from "../store/useAppStore";
import { CharacterCard } from "./CharacterCard";

interface CollectionDrawerProps {
  open: boolean;
  onClose: () => void;
  unlockedCharacters: Character[];
  totalCompletionCount: number;
}

export function CollectionDrawer({
  open,
  onClose,
  unlockedCharacters,
  totalCompletionCount,
}: CollectionDrawerProps) {
  const unlockedIds = new Set(unlockedCharacters.map((character) => character.id));

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.4)",
              zIndex: 200,
            }}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 201,
              backgroundColor: "#fff",
              borderRadius: "24px 24px 0 0",
              padding: "24px 20px 40px",
              maxHeight: "75vh",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                width: 36,
                height: 4,
                backgroundColor: "#e0e0e0",
                borderRadius: 99,
                margin: "0 auto 20px",
              }}
            />

            <h2
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: "#191919",
                margin: "0 0 4px",
              }}
            >
              응원단 모음
            </h2>
            <p style={{ fontSize: 13, color: "#888", margin: "0 0 20px" }}>
              누적 달성 <strong style={{ color: "#9575CD" }}>{totalCompletionCount}개</strong>{" "}
              · {unlockedCharacters.length}/{ALL_CHARACTERS.length}명 합류
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 10,
                marginBottom: 24,
              }}
            >
              {ALL_CHARACTERS.map((character, index) => (
                <CharacterCard
                  key={character.id}
                  character={character}
                  unlocked={unlockedIds.has(character.id)}
                  index={index}
                />
              ))}
            </div>

            <Button onClick={onClose} style={{ width: "100%" }}>
              닫기
            </Button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
