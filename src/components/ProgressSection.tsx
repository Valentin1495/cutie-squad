import { ProgressBar } from "@toss/tds-mobile";
import { motion } from "framer-motion";

interface ProgressSectionProps {
  done: number;
  total: number;
}

const MESSAGES = [
  { threshold: 0, text: "오늘의 응원판이 준비됐어요." },
  { threshold: 0.2, text: "좋은 출발이에요. 작은 승리가 쌓이고 있어요." },
  { threshold: 0.4, text: "흐름을 탔어요. 응원단도 신났습니다." },
  { threshold: 0.6, text: "절반을 넘겼어요. 오늘 꽤 멋진데요?" },
  { threshold: 0.8, text: "거의 다 왔어요. 마지막 한 걸음만!" },
  { threshold: 1, text: "오늘 목표 완료. 응원단 전원 기립박수!" },
];

function getMessage(ratio: number): string {
  const message = [...MESSAGES].reverse().find((item) => ratio >= item.threshold);
  return message?.text ?? MESSAGES[0].text;
}

export function ProgressSection({ done, total }: ProgressSectionProps) {
  const ratio = total === 0 ? 0 : done / total;
  const message = getMessage(ratio);

  return (
    <div style={{ padding: "20px 20px 0" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <span style={{ fontSize: 13, color: "#666", fontWeight: 600 }}>오늘의 목표</span>
        <motion.span
          key={done}
          initial={{ scale: 1.3, color: "#9575CD" }}
          animate={{ scale: 1, color: "#9575CD" }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{ fontSize: 14, fontWeight: 800 }}
        >
          {done} / {total}
        </motion.span>
      </div>

      <ProgressBar progress={ratio} size="bold" color="#9575CD" animate />

      <motion.p
        key={message}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          marginTop: 10,
          fontSize: 13,
          color: "#888",
          textAlign: "center",
        }}
      >
        {message}
      </motion.p>
    </div>
  );
}
