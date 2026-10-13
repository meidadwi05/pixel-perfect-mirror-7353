import { useRef, type ClipboardEvent, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

type Props = { value: string; onChange: (v: string) => void; length?: number; invalid?: boolean; disabled?: boolean };

export function OtpInput({ value, onChange, length = 6, invalid, disabled }: Props) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? "");

  const setAt = (i: number, d: string) => {
    const arr = digits.slice();
    arr[i] = d;
    onChange(arr.join("").slice(0, length));
  };

  const handleInput = (i: number, raw: string) => {
    const only = raw.replace(/\D/g, "");
    if (!only) return setAt(i, "");
    if (only.length > 1) {
      // autofill / paste via input
      const merged = (digits.slice(0, i).join("") + only).slice(0, length);
      onChange(merged);
      refs.current[Math.min(merged.length, length - 1)]?.focus();
      return;
    }
    setAt(i, only);
    if (i < length - 1) refs.current[i + 1]?.focus();
  };

  const onKey = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      e.preventDefault();
      setAt(i - 1, "");
      refs.current[i - 1]?.focus();
    } else if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
    else if (e.key === "ArrowRight" && i < length - 1) refs.current[i + 1]?.focus();
  };

  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const p = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!p) return;
    e.preventDefault();
    onChange(p);
    refs.current[Math.min(p.length, length - 1)]?.focus();
  };

  return (
    <div className="flex justify-center gap-1.5 sm:gap-2" role="group" aria-label="Kode OTP 6 digit">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          value={d}
          disabled={disabled}
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={i === 0 ? length : 1}
          aria-label={`Digit ${i + 1}`}
          aria-invalid={invalid}
          onChange={(e) => handleInput(i, e.target.value)}
          onKeyDown={(e) => onKey(i, e)}
          onPaste={onPaste}
          onFocus={(e) => e.target.select()}
          className={cn(
            "h-12 w-10 min-w-0 rounded-xl border bg-field text-center text-lg font-bold text-field-foreground outline-none transition focus:border-brand focus:ring-2 focus:ring-ring/40 sm:w-11",
            invalid ? "border-destructive" : "border-input",
          )}
        />
      ))}
    </div>
  );
}
