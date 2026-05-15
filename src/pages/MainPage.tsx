import { FixedBottomCTA, Top } from "@toss/tds-mobile";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { CollectionDrawer } from "../components/CollectionDrawer";
import { GoalEditor } from "../components/GoalEditor";
import { GoalItem } from "../components/GoalItem";
import { ProgressSection } from "../components/ProgressSection";
import { useHaptic } from "../hooks/useHaptic";
import { useAppStore, type GoalInput } from "../store/useAppStore";

export function MainPage() {
  const haptic = useHaptic();
  const {
    goals,
    unlockedCharacters,
    totalCompletionCount,
    toggleGoal,
    updateGoals,
    resetOnboarding,
  } = useAppStore();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  const done = goals.filter((goal) => goal.done).length;
  const allDone = goals.length > 0 && done === goals.length;
  const today = new Date().toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  const openDrawer = () => {
    haptic("basicMedium");
    setDrawerOpen(true);
  };

  const handleSaveGoals = (nextGoals: GoalInput[]) => {
    haptic("success");
    updateGoals(nextGoals);
    setEditing(false);
  };

  const handleResetOnboarding = () => {
    const confirmed = window.confirm(
      "지금까지의 목표와 응원단 기록을 모두 지우고 처음 설정 화면으로 돌아갈까요?",
    );
    if (!confirmed) return;

    haptic("success");
    resetOnboarding();
  };

  if (editing) {
    return (
      <GoalEditor
        mode="edit"
        initialGoals={goals}
        title="응원판을 다시 짜볼까요?"
        subtitle="완료한 목표는 그대로 인정하고, 새로 추가한 목표만 오늘 다시 응원할게요."
        submitLabel="수정 완료"
        onSubmit={handleSaveGoals}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#fafaf8",
        paddingBottom: 116,
      }}
    >
      <Top
        title={<Top.TitleParagraph size={22}>오늘의 응원판</Top.TitleParagraph>}
        subtitleBottom={
          <Top.SubtitleParagraph size={15}>{today}</Top.SubtitleParagraph>
        }
        right={
          <button
            onClick={openDrawer}
            style={{
              background: "none",
              border: "none",
              fontSize: 24,
              cursor: "pointer",
              padding: 4,
            }}
            aria-label="응원단 보기"
          >
            🐼
          </button>
        }
      />

      <ProgressSection done={done} total={goals.length} />

      {allDone ? (
        <motion.div
          initial={{ opacity: 0, y: 14, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          style={{ padding: "20px" }}
        >
          <div
            style={{
              borderRadius: 20,
              backgroundColor: "#fff",
              border: "1px solid rgba(149,117,205,0.22)",
              padding: "28px 22px",
              textAlign: "center",
              boxShadow: "0 12px 30px rgba(149,117,205,0.1)",
            }}
          >
            <div style={{ fontSize: 46, marginBottom: 10 }}>🎉</div>
            <h2 style={{ margin: "0 0 8px", color: "#191919", fontSize: 21 }}>
              오늘 목표를 모두 달성했어요!
            </h2>
            <p
              style={{
                margin: 0,
                color: "#666",
                fontSize: 14,
                lineHeight: 1.55,
              }}
            >
              같은 목표를 다시 체크하지 않아도 괜찮아요.
              <br />
              내일이 되면 응원판이 새롭게 열립니다.
            </p>
          </div>
        </motion.div>
      ) : (
        <div
          style={{
            padding: "16px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <AnimatePresence mode="popLayout">
            {goals.map((goal, index) => (
              <motion.div
                key={goal.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
              >
                <GoalItem goal={goal} onToggle={toggleGoal} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <div style={{ padding: "0 20px 20px" }}>
        <div
          style={{
            padding: "14px 18px",
            borderRadius: 14,
            backgroundColor: "rgba(149, 117, 205, 0.08)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 10,
          }}
        >
          <span style={{ fontSize: 20 }}>📊</span>
          <div>
            <p
              style={{
                fontSize: 12,
                color: "#9575CD",
                fontWeight: 700,
                margin: 0,
              }}
            >
              누적 달성
            </p>
            <p style={{ fontSize: 14, color: "#555", margin: 0 }}>
              총{" "}
              <strong style={{ color: "#9575CD" }}>
                {totalCompletionCount}개
              </strong>{" "}
              목표 완료 · 응원단{" "}
              <strong style={{ color: "#9575CD" }}>
                {unlockedCharacters.length}명
              </strong>{" "}
              합류
            </p>
          </div>
        </div>
        <button
          onClick={() => setEditing(true)}
          style={{
            width: "100%",
            border: "1px solid rgba(149,117,205,0.18)",
            borderRadius: 14,
            backgroundColor: "#fff",
            color: "#7957b8",
            fontSize: 14,
            fontWeight: 800,
            padding: "13px 16px",
          }}
        >
          목표 수정하기
        </button>
        <button
          onClick={handleResetOnboarding}
          style={{
            width: "100%",
            border: "1px solid rgba(240,68,82,0.18)",
            borderRadius: 14,
            backgroundColor: "#fff",
            color: "#f04452",
            fontSize: 14,
            fontWeight: 800,
            padding: "13px 16px",
            marginTop: 10,
          }}
        >
          처음부터 다시 시작하기
        </button>
      </div>

      <FixedBottomCTA
        onClick={openDrawer}
        style={{ backgroundColor: "#9575CD" }}
      >
        응원단 보기 ({unlockedCharacters.length}/8)
      </FixedBottomCTA>

      <CollectionDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        unlockedCharacters={unlockedCharacters}
        totalCompletionCount={totalCompletionCount}
      />
    </div>
  );
}
