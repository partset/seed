import { useEffect, useRef, useState } from "react";

function clamp(value: number, min: number, max: number)
{
  return Math.min(Math.max(value, min), max);
}

function mapRange(value: number, start: number, end: number)
{
  if (end <= start)
  {
    return 1;
  }

  return clamp((value - start) / (end - start), 0, 1);
}

type PinPhase = "before" | "pinned" | "after";

export default function GlassPanelsFixedPinSection()
{
  const sectionRef = useRef<HTMLElement | null>(null);

  const [rawProgress, setRawProgress] = useState(0);
  const [pinPhase, setPinPhase] = useState<PinPhase>("before");

  useEffect(() =>
  {
    const handleScroll = () =>
    {
      if (!sectionRef.current)
      {
        return;
      }

      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const sectionHeight = section.offsetHeight;
      const viewportHeight = window.innerHeight;

      const pinStart = sectionTop;
      const pinEnd = sectionTop + sectionHeight - viewportHeight;
      const currentY = window.scrollY;

      const nextProgress =
        pinEnd > pinStart ? (currentY - pinStart) / (pinEnd - pinStart) : 0;

      setRawProgress(clamp(nextProgress, 0, 1));

      if (currentY < pinStart)
      {
        setPinPhase("before");
      }
      else if (currentY > pinEnd)
      {
        setPinPhase("after");
      }
      else
      {
        setPinPhase("pinned");
      }
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () =>
    {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const spreadProgress = mapRange(rawProgress, 0, 0.72);

  const frontStyle = {
    transform: `translate3d(${-8 - 170 * spreadProgress}px, ${20 + 130 * spreadProgress}px, 0)
      rotate(${-8 - 5 * spreadProgress}deg)`,
  };

  const middleStyle = {
    transform: `translate3d(0px, 0px, 0)
      rotate(-1.5deg)`,
  };

  const backStyle = {
    transform: `translate3d(${20 + 165 * spreadProgress}px, ${-20 - 95 * spreadProgress}px, 0)
      rotate(${6 + 4 * spreadProgress}deg)`,
  };

  const panelClassName =
    "absolute h-[360px] w-[240px] rounded-none border border-[rgba(255,255,255,0.18)] bg-[rgba(235,235,230,0.14)] shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur-[3px] will-change-transform";

  let pinLayerClassName = "absolute inset-x-0 top-0 h-screen";

  if (pinPhase === "pinned")
  {
    pinLayerClassName = "fixed inset-x-0 top-0 h-screen";
  }
  else if (pinPhase === "after")
  {
    pinLayerClassName = "absolute inset-x-0 bottom-0 h-screen";
  }

  return (
    <section
      ref={sectionRef}
      className="relative h-[280vh] bg-background-dark"
    >
      <div className="relative h-full">
        <div className={pinLayerClassName}>
          <div className="relative mx-auto h-full w-full max-w-7xl">
            <div
              className="absolute left-[18%] top-1/2 h-[520px] w-[520px] -translate-y-1/2"
            >
              <div
                style={backStyle}
                className={panelClassName}
              />

              <div
                style={middleStyle}
                className={panelClassName}
              />

              <div
                style={frontStyle}
                className={panelClassName}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}