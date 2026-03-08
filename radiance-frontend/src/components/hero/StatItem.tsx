import { useEffect, useState } from "react";

type StatItemProps = {
  value: number;
  label: string;
  duration: number;
  suffix?: string;
  startAnimation?: boolean;
};

export default function StatItem({
  value,
  label,
  duration,
  suffix = "",
  startAnimation = false,
}: StatItemProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startAnimation) return;

    let startTimestamp: number | null = null;
    let animationFrameId = 0;

    const step = (timestamp: number) => {
      if (startTimestamp === null) {
        startTimestamp = timestamp;
      }

      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const nextValue = Math.floor(progress * value);

      setCount((previousCount) => {
        if (previousCount === nextValue) {
          return previousCount;
        }

        return nextValue;
      });

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        setCount(value);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [duration, startAnimation, value]);

  return (
    <div className="flex min-w-[120px] flex-col items-center justify-center gap-1 text-center">
      <span className="font-display text-[clamp(28px,4vw,48px)] tracking-[0.05em] text-foreground">
        {count}
        {startAnimation ? suffix : ""}
      </span>
      <span className="text-[14px] uppercase tracking-[0.18em] text-foreground/40">
        {label}
      </span>
    </div>
  );
}
