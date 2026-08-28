import { cn } from "@/lib/utils";

/**
 * Staggered word reveal driven entirely by CSS.
 *
 * This deliberately avoids a JS-driven opacity animation: the words must be
 * present and end up visible in the server-rendered HTML, otherwise the copy is
 * invisible to anything that does not execute the animation.
 */
export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
}) => {
  const wordsArray = words.split(" ");

  return (
    <div className={cn("font-bold", className)}>
      <div className="mt-4">
        <div className="dark:text-white text-black leading-snug tracking-wide">
          {wordsArray.map((word, idx) => (
            <span
              key={`${word}-${idx}`}
              className="animate-word-fade-in dark:text-white text-black"
              style={{
                animationDelay: `${idx * 0.03}s`,
                animationDuration: `${duration}s`,
                ...(filter ? {} : { filter: "none" }),
              }}
            >
              {word}{" "}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
