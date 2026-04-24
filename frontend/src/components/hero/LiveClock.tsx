import { useEffect, useState } from "react";
import { formatClock } from "../../utils/formatClock";

type LiveClockProps = {
  timezone: string;
};

export default function LiveClock({ timezone }: LiveClockProps) {
  const [time, setTime] = useState(() => formatClock(timezone));

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setTime(formatClock(timezone));
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [timezone]);

  return (
    <span className="text-sm tracking-[0.06em] text-foreground/45 tabular-nums">
      {time}
    </span>
  );
}
