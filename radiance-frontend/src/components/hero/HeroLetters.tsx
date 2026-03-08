type HeroLettersProps = {
  word: string;
};

export default function HeroLetters({ word }: HeroLettersProps) {
  const letters = word.split("");

  return (
    <div className="relative z-[2] mb-14 flex items-center justify-center gap-[clamp(2px,0.8vw,10px)]">
      {letters.map((letter, index) => (
        <span
          key={`${letter}-${index}`}
          className={`hero-letter hero-letter-${index + 1}`}
          style={{
            ["--letter-delay" as string]: `${0.5 + index * 0.12}s`,
          }}
        >
          {letter}
        </span>
      ))}
    </div>
  );
}
