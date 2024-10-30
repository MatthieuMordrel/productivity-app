import { useCompletion } from "@/contexts/CompletionContext";

const TimeSession = () => {
  const { remainingTime } = useCompletion();
  const [minutes, seconds] = remainingTime?.split(":").map(Number) || [0, 0];

  return (
    <>
      {minutes?.toString().padStart(2, "0") ?? "00"}:
      {seconds?.toString().padStart(2, "0") ?? "00"}
    </>
  );
};

export default TimeSession;
