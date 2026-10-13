import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Loader2, Lock, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/hireloop/Field";
import { Logo } from "@/components/hireloop/Logo";
import { Modal } from "@/components/hireloop/Modal";
import { validateLogin } from "@/lib/validation";
import { memoryStore } from "@/lib/app-state";
import { login } from "@/services/auth.service";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Masuk — HireLoop" },
      { name: "description", content: "Masuk ke akun HireLoop untuk melanjutkan pencarian kerja." },
      { property: "og:title", content: "Masuk — HireLoop" },
      { property: "og:description", content: "Temukan pekerjaan terbaik dan pantau proses lamaranmu." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<ReturnType<typeof validateLogin>>({});
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<null | "success" | "google">(null);

  useEffect(() => {
    const pre = memoryStore.takeLoginEmail();
    if (pre) setEmail(pre);
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validateLogin({ email, password });
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    await login(email, password);
    setLoading(false);
    setPassword("");
    setModal("success");
  };

  return (
    <main className="app-frame flex flex-col bg-gradient-navy px-5 pb-8 pt-12">
      <div className="text-center">
        <Logo className="text-4xl" />
        <p className="mx-auto mt-3 max-w-[240px] text-sm text-navy-muted">
          Temukan pekerjaan terbaik dan pantau proses lamaranmu
        </p>
      </div>

      <form onSubmit={submit} noValidate className="mt-8 rounded-3xl bg-card p-5 shadow-card">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-brand">Selamat Datang!</h1>
            <p className="text-sm text-muted-foreground">Masuk untuk melanjutkan</p>
          </div>
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-cta text-primary-foreground shadow-cta">
            <ShieldCheck className="size-6" />
          </span>
        </div>

        <div className="mt-5 space-y-4">
          <Field
            label="Email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="Masukkan email kamu"
            icon={<Mail />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />
          <Field
            label="Password"
            password
            autoComplete="current-password"
            placeholder="Masukkan password"
            icon={<Lock />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />
        </div>

        <div className="mt-2 flex items-center justify-between gap-2">
          <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="size-4 accent-brand"
            />
            Ingat saya
          </label>
          <Link to="/lupa-password" className="flex min-h-11 items-center text-sm font-semibold text-brand">
            Lupa kata sandi?
          </Link>
        </div>

        <Button type="submit" variant="cta" size="xl" className="mt-2" disabled={loading}>
          {loading && <Loader2 className="animate-spin" />} Masuk
        </Button>

        <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> atau <span className="h-px flex-1 bg-border" />
        </div>

        <Button type="button" variant="google" size="xl" onClick={() => setModal("google")}>
          <GoogleIcon /> Masuk dengan Google
        </Button>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          Belum punya akun?{" "}
          <Link to="/daftar" className="font-semibold text-brand">
            Daftar Sekarang
          </Link>
        </p>
      </form>

      <Modal
        open={modal === "success"}
        onOpenChange={(o) => !o && setModal(null)}
        title="Berhasil Masuk!"
        description={<p>Login berhasil dalam mode simulasi. Belum ada sesi yang dibuat.</p>}
      >
        <Button variant="cta" size="xl" onClick={() => setModal(null)}>
          OK
        </Button>
      </Modal>
      <Modal
        open={modal === "google"}
        onOpenChange={(o) => !o && setModal(null)}
        title="Segera Hadir"
        description={<p>Integrasi masuk dengan Google belum tersedia.</p>}
      >
        <Button variant="cta" size="xl" onClick={() => setModal(null)}>
          Oke, Mengerti
        </Button>
      </Modal>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.5-.2-2.3H12v4.4h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2-1.9 3.2-4.7 3.2-8.1Z" />
      <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.7c-1 .7-2.2 1-3.7 1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.8A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.8 14.1a6.6 6.6 0 0 1 0-4.2V7.1H2.1a11 11 0 0 0 0 9.8l3.7-2.8Z" />
      <path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 0 0 2.1 7.1l3.7 2.8C6.7 7.3 9.1 5.4 12 5.4Z" />
    </svg>
  );
}
