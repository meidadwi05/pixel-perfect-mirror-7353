import { useEffect, useState } from "react";
import { Download, RefreshCw, Share, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { registerPwa } from "@/lib/pwa";

type BIPEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<unknown> };

export function PwaPrompts() {
  const [installEvt, setInstallEvt] = useState<BIPEvent | null>(null);
  const [ios, setIos] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [update, setUpdate] = useState<null | (() => void)>(null);

  useEffect(() => {
    const onBip = (e: Event) => {
      e.preventDefault();
      setInstallEvt(e as BIPEvent);
    };
    window.addEventListener("beforeinstallprompt", onBip);
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone;
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    if (isIos && !standalone && window.self === window.top) setIos(true);
    registerPwa((apply) => setUpdate(() => apply));
    return () => window.removeEventListener("beforeinstallprompt", onBip);
  }, []);

  if (update) {
    return (
      <Banner onClose={() => setUpdate(null)}>
        <span className="min-w-0 flex-1">Versi baru HireLoop tersedia.</span>
        <Button size="sm" variant="cta" onClick={update}>
          <RefreshCw /> Muat ulang
        </Button>
      </Banner>
    );
  }
  if (dismissed) return null;
  if (installEvt) {
    return (
      <Banner onClose={() => setDismissed(true)}>
        <span className="min-w-0 flex-1">Pasang HireLoop di perangkatmu.</span>
        <Button
          size="sm"
          variant="cta"
          onClick={async () => {
            await installEvt.prompt();
            setInstallEvt(null);
          }}
        >
          <Download /> Pasang
        </Button>
      </Banner>
    );
  }
  if (ios) {
    return (
      <Banner onClose={() => setDismissed(true)}>
        <span className="min-w-0 flex-1">
          Pasang di iPhone: ketuk <Share className="inline size-4" /> lalu “Tambah ke Layar Utama”.
        </span>
      </Banner>
    );
  }
  return null;
}

function Banner({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div role="status" className="fixed inset-x-0 bottom-3 z-40 mx-auto w-[calc(100%-1.5rem)] max-w-[416px]">
      <div className="flex items-center gap-2 rounded-2xl bg-card p-3 pl-4 text-sm text-card-foreground shadow-card">
        {children}
        <button onClick={onClose} aria-label="Tutup" className="grid size-11 shrink-0 place-items-center text-muted-foreground">
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
