import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Logo } from "@/components/hireloop/Logo";
import { isOnboardingDone } from "@/lib/app-state";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HireLoop — Find the right job" },
      { name: "description", content: "HireLoop membantu kamu menemukan dan melamar pekerjaan yang tepat." },
      { property: "og:title", content: "HireLoop — Find the right job" },
      { property: "og:description", content: "Lamar kerja lebih cepat & tepat sasaran bersama HireLoop." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Splash,
});

function Splash() {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => {
      navigate({ to: isOnboardingDone() ? "/login" : "/onboarding", replace: true });
    }, 1500);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <main className="app-frame grid place-items-center bg-gradient-navy">
      <div className="pointer-events-none absolute -right-24 top-10 size-72 rounded-full border border-navy-foreground/10" />
      <div className="pointer-events-none absolute -left-20 bottom-24 size-60 rounded-full border border-navy-foreground/10" />
      <div className="text-center animate-in fade-in zoom-in-95 duration-700">
        <Logo className="text-5xl" />
        <div className="mx-auto mt-6 h-1 w-12 rounded-full bg-gradient-cta" />
        <p className="mt-6 text-base text-navy-foreground">Find the right job.</p>
        <p className="text-base text-navy-foreground">
          <span className="font-semibold text-cyan">Loop</span> into your future
        </p>
      </div>
    </main>
  );
}
