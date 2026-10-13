import { useId, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon?: ReactNode;
  error?: string;
  tone?: "light" | "dark";
  password?: boolean;
};

export function Field({ label, icon, error, tone = "light", password, className, id, type, ...rest }: Props) {
  const auto = useId();
  const fid = id ?? auto;
  const [show, setShow] = useState(false);
  const errId = `${fid}-err`;
  return (
    <div className={cn("space-y-1.5", className)}>
      <label
        htmlFor={fid}
        className={cn("block text-[13px] font-medium", tone === "dark" ? "text-navy-foreground" : "text-foreground")}
      >
        {label}
      </label>
      <div
        className={cn(
          "flex h-12 items-center gap-2 rounded-xl border bg-field px-3 text-field-foreground transition-colors focus-within:border-brand focus-within:ring-2 focus-within:ring-ring/40",
          error ? "border-destructive" : "border-input",
        )}
      >
        {icon && <span className="shrink-0 text-muted-foreground [&_svg]:size-[18px]">{icon}</span>}
        <input
          id={fid}
          type={password ? (show ? "text" : "password") : type}
          aria-invalid={!!error}
          aria-describedby={error ? errId : undefined}
          className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/70 focus-visible:outline-none"
          {...rest}
        />
        {password && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
            className="-mr-2 grid size-11 shrink-0 place-items-center rounded-lg text-muted-foreground"
          >
            {show ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
          </button>
        )}
      </div>
      {error && (
        <p id={errId} role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
