import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { markOnboardingDone } from "@/lib/app-state";
import img1 from "@/assets/onboard-1.png";
import img2 from "@/assets/onboard-2.png";
import img3 from "@/assets/onboard-3.png";
import img4 from "@/assets/onboard-4.png";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Kenalan dengan HireLoop" },
      { name: "description", content: "Pelajari cara HireLoop membantu kamu melamar kerja lebih cepat." },
      { property: "og:title", content: "Kenalan dengan HireLoop" },
      { property: "og:description", content: "Lamar, pantau, dan temukan pekerjaan yang tepat." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Onboarding,
});

const slides = [
  {
    img: img1,
    dark: false,
    title: (
      <>
        Lamar kerja lebih <span className="text-brand">cepat & tepat sasaran</span>
      </>
    ),
    desc: "Cari lowongan dari berbagai perusahaan terpercaya sesuai dengan minat dan keahlian.",
  },
  {
    img: img2,
    dark: true,
    title: <>Pantau Proses Lamaran Secara Real-Time</>,
    desc: "Dapatkan update setiap tahap seleksi lamaran pekerjaan langsung di genggaman.",
  },
  {
    img: img3,
    dark: false,
    title: (
      <>
        Lamar ke Banyak <span className="text-brand">Perusahaan Sekaligus</span>
      </>
    ),
    desc: "Kirim lamaran ke berbagai perusahaan dan pantau semuanya dalam satu aplikasi tanpa ribet.",
  },
  {
    img: img4,
    dark: true,
    title: <>Temukan Pekerjaan yang Tepat</>,
    desc: "Sistem kami akan merekomendasikan pekerjaan terbaik berdasarkan profil dan aktivitasmu.",
  },
];

function Onboarding() {
  const navigate = useNavigate();
  const [i, setI] = useState(0);
  const startX = useRef<number | null>(null);
  const s = slides[i];
  const last = i === slides.length - 1;

  const finish = () => {
    markOnboardingDone();
    navigate({ to: "/login", replace: true });
  };
  const next = () => (last ? finish() : setI(i + 1));

  return (
    <main
      className={cn(
        "app-frame flex flex-col px-6 pb-8 pt-5 transition-colors duration-300",
        s.dark ? "bg-gradient-navy text-navy-foreground" : "bg-background text-foreground",
      )}
      onTouchStart={(e) => (startX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (startX.current == null) return;
        const dx = e.changedTouches[0].clientX - startX.current;
        if (dx < -50 && !last) setI(i + 1);
        if (dx > 50 && i > 0) setI(i - 1);
        startX.current = null;
      }}
    >
      <div className="flex h-11 justify-end">
        {!last && (
          <button
            onClick={finish}
            className={cn("min-h-11 px-2 text-sm font-semibold", s.dark ? "text-cyan" : "text-brand")}
          >
            Lewati
          </button>
        )}
      </div>
      <div key={i} className="flex flex-1 flex-col animate-in fade-in slide-in-from-right-6 duration-300" aria-live="polite">
        <div className="flex flex-1 items-center justify-center py-4">
          <img src={s.img} alt="" width={1024} height={1024} className="max-h-[42dvh] w-auto animate-float object-contain" />
        </div>
        <h1 className="text-[26px] font-bold leading-tight">{s.title}</h1>
        <p className={cn("mt-3 text-sm leading-relaxed", s.dark ? "text-navy-muted" : "text-muted-foreground")}>
          {s.desc}
        </p>
      </div>
      <div className="mt-6 flex gap-2" role="tablist" aria-label="Halaman onboarding">
        {slides.map((_, k) => (
          <button
            key={k}
            role="tab"
            aria-selected={k === i}
            aria-label={`Halaman ${k + 1}`}
            onClick={() => setI(k)}
            className="grid h-11 place-items-center"
          >
            <span
              className={cn(
                "block h-2 rounded-full transition-all",
                k === i ? "w-6 bg-brand" : cn("w-2", s.dark ? "bg-navy-foreground/30" : "bg-input"),
              )}
            />
          </button>
        ))}
      </div>
      <Button variant="cta" size="xl" className="mt-4" onClick={next}>
        {last ? "Mulai Sekarang" : "Selanjutnya"} <ArrowRight />
      </Button>
    </main>
  );
}
