import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, CheckCircle2, Loader2, Lock, Mail, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/hireloop/Field";
import { Modal } from "@/components/hireloop/Modal";
import { OtpInput } from "@/components/hireloop/OtpInput";
import { validateRegister, type RegisterInput } from "@/lib/validation";
import { memoryStore } from "@/lib/app-state";
import { OTP_RESEND_SECONDS, register, sendOtp, verifyOtp } from "@/services/auth.service";
import registerImg from "@/assets/register.png";
import mailImg from "@/assets/mail-success.png";

export const Route = createFileRoute("/daftar")({
  head: () => ({
    meta: [
      { title: "Buat Akun — HireLoop" },
      { name: "description", content: "Daftar akun HireLoop dan mulai melamar pekerjaan impianmu." },
      { property: "og:title", content: "Buat Akun — HireLoop" },
      { property: "og:description", content: "Lengkapi informasi berikut untuk memulai perjalanan karirmu." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RegisterPage,
});

const empty: RegisterInput = { firstName: "", lastName: "", email: "", phone: "", password: "", confirmPassword: "" };

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterInput>(() => ({ ...empty, ...(memoryStore.getDraft() ?? {}) }));
  const [errors, setErrors] = useState<ReturnType<typeof validateRegister>>({});
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<null | "registered" | "otp" | "verified">(null);

  const set = (k: keyof RegisterInput) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validateRegister(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    await register(form);
    const { password: _p, confirmPassword: _c, ...draft } = form;
    memoryStore.setDraft(draft);
    setLoading(false);
    setStep("registered");
  };

  const cancelOtp = () => {
    setForm((f) => ({ ...f, password: "", confirmPassword: "" }));
    setStep(null);
  };

  const done = () => {
    memoryStore.setLoginEmail(form.email);
    memoryStore.setDraft(null);
    navigate({ to: "/login" });
  };

  return (
    <main className="app-frame flex flex-col bg-gradient-navy pb-8">
      <section className="relative px-5 pt-4">
        <Link to="/login" aria-label="Kembali ke login" className="grid size-11 place-items-center rounded-xl text-navy-foreground">
          <ArrowLeft className="size-5" />
        </Link>
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
          <div className="min-w-0">
            <h1 className="text-[28px] font-bold text-navy-foreground">Buat Akun</h1>
            <p className="mt-1 text-sm text-navy-muted">Lengkapi informasi berikut untuk memulai perjalanan karirmu.</p>
          </div>
          <img src={registerImg} alt="" width={1024} height={1024} className="-mt-8 size-32 shrink-0 object-contain" />
        </div>
      </section>

      <form onSubmit={submit} noValidate className="mx-4 mt-4 space-y-4 rounded-3xl bg-navy-card p-5 shadow-card">
        <Field tone="dark" label="Nama Depan" autoComplete="given-name" placeholder="Masukkan nama depan" icon={<User />} value={form.firstName} onChange={set("firstName")} error={errors.firstName} />
        <Field tone="dark" label="Nama Belakang (opsional)" autoComplete="family-name" placeholder="Masukkan nama belakang" icon={<User />} value={form.lastName} onChange={set("lastName")} />
        <Field tone="dark" label="Email" type="email" inputMode="email" autoComplete="email" placeholder="Masukkan email" icon={<Mail />} value={form.email} onChange={set("email")} error={errors.email} />
        <Field tone="dark" label="Nomor Handphone" type="tel" inputMode="tel" autoComplete="tel" placeholder="08xxxxxxxxxx" icon={<Phone />} value={form.phone} onChange={set("phone")} error={errors.phone} />
        <Field tone="dark" label="Kata Sandi" password autoComplete="new-password" placeholder="Masukkan kata sandi" icon={<Lock />} value={form.password} onChange={set("password")} error={errors.password} />
        <Field tone="dark" label="Konfirmasi Kata Sandi" password autoComplete="new-password" placeholder="Masukkan ulang kata sandi" icon={<Lock />} value={form.confirmPassword} onChange={set("confirmPassword")} error={errors.confirmPassword} />
        <Button type="submit" variant="cta" size="xl" className="!mt-6" disabled={loading}>
          {loading && <Loader2 className="animate-spin" />} Daftar
        </Button>
        <p className="text-center text-sm text-navy-muted">
          Sudah punya akun?{" "}
          <Link to="/login" className="font-semibold text-cyan">
            Masuk
          </Link>
        </p>
      </form>

      <Modal
        open={step === "registered"}
        dismissable={false}
        title="Registrasi Berhasil!"
        image={<img src={mailImg} alt="" width={1024} height={1024} className="size-24 object-contain" />}
        description={
          <>
            <p>Akun kamu telah dibuat. Verifikasi email diperlukan — kode OTP akan dikirim ke email:</p>
            <p className="mt-2 break-all font-semibold text-brand">{form.email}</p>
            <p className="mt-3 text-xs">Mode simulasi: pengiriman OTP belum sungguhan.</p>
          </>
        }
      >
        <Button variant="cta" size="xl" onClick={() => setStep("otp")}>
          Lanjut Verifikasi
        </Button>
      </Modal>

      {step === "otp" && <OtpModal email={form.email} onCancel={cancelOtp} onSuccess={() => setStep("verified")} />}

      <Modal
        open={step === "verified"}
        dismissable={false}
        title="Verifikasi Berhasil!"
        image={<CheckCircle2 className="size-20 fill-success text-card" aria-hidden="true" />}
        description={<p>Akun kamu berhasil diverifikasi (mode simulasi). Silakan masuk untuk melanjutkan.</p>}
      >
        <Button variant="cta" size="xl" onClick={done}>
          OK
        </Button>
      </Modal>
    </main>
  );
}

function OtpModal({ email, onCancel, onSuccess }: { email: string; onCancel: () => void; onSuccess: () => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [expiresAt, setExpiresAt] = useState<number>(0);
  const [left, setLeft] = useState(OTP_RESEND_SECONDS);

  const start = async () => {
    setCode("");
    setError(undefined);
    setLeft(OTP_RESEND_SECONDS);
    const r = await sendOtp(email);
    setExpiresAt(r.expiresAt);
  };

  useEffect(() => {
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);

  const verify = async () => {
    setLoading(true);
    setError(undefined);
    const r = await verifyOtp(email, code, expiresAt);
    setLoading(false);
    if (r.ok) return onSuccess();
    setError(r.reason === "expired" ? "Kode sudah kedaluwarsa. Silakan kirim ulang OTP." : "Kode OTP salah. Coba lagi.");
  };

  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  return (
    <Modal
      open
      onOpenChange={(o) => !o && onCancel()}
      title="Verifikasi OTP"
      description={
        <>
          <p>Masukkan 6 digit kode yang kami kirim ke</p>
          <p className="mt-1 break-all font-semibold text-brand">{email}</p>
        </>
      }
    >
      <OtpInput value={code} onChange={(v) => { setCode(v); setError(undefined); }} invalid={!!error} disabled={loading} />
      {error && <p role="alert" className="mt-3 text-sm font-medium text-destructive">{error}</p>}
      <p className="mt-3 rounded-lg bg-accent px-3 py-2 text-xs font-medium text-accent-foreground">
        Mode demo: gunakan 123456
      </p>
      <Button variant="cta" size="xl" className="mt-4" disabled={code.length < 6 || loading} onClick={verify}>
        {loading && <Loader2 className="animate-spin" />} Verifikasi OTP
      </Button>
      <div className="mt-3 text-sm text-muted-foreground">
        {left > 0 ? (
          <p aria-live="polite">
            Kirim ulang OTP dalam <span className="font-semibold text-foreground">{mm}:{ss}</span>
          </p>
        ) : (
          <button type="button" onClick={start} className="min-h-11 font-semibold text-brand">
            Kirim ulang OTP
          </button>
        )}
      </div>
      <button type="button" onClick={onCancel} className="mt-1 min-h-11 w-full text-sm font-medium text-muted-foreground">
        Batal
      </button>
    </Modal>
  );
}
