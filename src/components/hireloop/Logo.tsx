import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn("inline-flex items-center font-extrabold tracking-tight text-navy-foreground", className)}
      aria-label="HireLoop"
    >
      Hire<span className="text-cyan">L</span>
      <svg viewBox="0 0 48 24" className="mx-[0.02em] h-[0.7em] w-[1.4em]" aria-hidden="true">
        <path
          d="M12 4a8 8 0 1 0 0 16c4.5 0 7.5-4 12-8s7.5-8 12-8a8 8 0 1 1 0 16c-4.5 0-7.5-4-12-8S16.5 4 12 4Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-cyan"
        />
      </svg>
      <span className="text-cyan">p</span>
    </span>
  );
}
