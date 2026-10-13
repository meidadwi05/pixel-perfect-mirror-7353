/** Satu-satunya tempat registrasi service worker. Tidak pernah aktif di dev/preview. */
function refused(): boolean {
  if (!import.meta.env.PROD) return true;
  if (window.self !== window.top) return true;
  const h = location.hostname;
  if (h.startsWith("id-preview--") || h.startsWith("preview--")) return true;
  if (/(^|\.)lovableproject(-dev)?\.com$/.test(h)) return true;
  if (/(^|\.)beta\.lovable\.dev$/.test(h)) return true;
  if (new URLSearchParams(location.search).get("sw") === "off") return true;
  return false;
}

export async function registerPwa(onUpdate: (apply: () => void) => void) {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
  if (refused()) {
    const regs = await navigator.serviceWorker.getRegistrations();
    await Promise.all(
      regs.filter((r) => r.active?.scriptURL.endsWith("/sw.js")).map((r) => r.unregister()),
    );
    return;
  }
  const { registerSW } = await import("virtual:pwa-register");
  const update = registerSW({
    onNeedRefresh() {
      onUpdate(() => update(true));
    },
  });
}
