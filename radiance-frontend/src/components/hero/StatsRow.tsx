import { useEffect, useState } from "react";
import type { Stat } from "../../constants/hero";
import StatItem from "./StatItem";

type StatsRowProps = {
  stats: Stat[];
};

const STATS_ANIMATION_DELAY_MS = 1600;

export default function StatsRow({ stats }: StatsRowProps) {
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setStartAnimation(true);
    }, STATS_ANIMATION_DELAY_MS);

    return () => {
      window.clearTimeout(timerId);
    };
  }, []);

  return (
    <div className="animate-fade-in-stats relative z-[2] flex w-full flex-wrap items-center justify-center gap-6 text-center sm:gap-12">
      {stats.map((stat, index) => (
        <div key={stat.id} className="flex items-center gap-6 sm:gap-12">
          <StatItem
            value={stat.value}
            label={stat.label}
            duration={stat.duration}
            suffix={stat.suffix}
            startAnimation={startAnimation}
          />

          {index < stats.length - 1 && (
            <div className="hidden h-12 w-px bg-foreground/12 sm:block" />
          )}
        </div>
      ))}
    </div>
  );
}
