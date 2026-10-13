import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/hireloop/Field";
import { Modal } from "@/components/hireloop/Modal";
import { validateEmail } from "@/lib/validation";
import { requestPasswordReset } from "@/services/auth.service";
import forgotImg from "@/assets/forgot.png";
import mailImg from "@/assets/mail-success.png";

export const Route = createFileRoute("/lupa-password")({
  head: () => ({
    meta: [
      { title: "Lupa Kata Sandi — HireLoop" },
      { name: "description", content: "Atur ulang kata sandi akun HireLoop kamu." },
      { property: "og:title", content: "Lupa Kata Sandi — HireLoop" },
      { property: "og:description", content: "Kirim tautan reset kata sandi ke email kamu." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ForgotPage,
});

function ForgotPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const err = validateEmail(email);
    setError(err);
    if (err) return;
    setLoading(true);
    await requestPasswordReset(email);
    setLoading(false);
    setSent(true);
  };

  return (
    <main className="app-frame flex flex-col bg-background">
      <header className="grid grid-cols-[44px_1fr_44px] items-center px-3 pt-4">
        <Link to="/login" aria-label="Kembali ke login" className="grid size-11 place-items-center rounded-xl text-foreground">
          <ArrowLeft className="size-5" />
        </Link>
        <h1 className="text-center text-lg font-bold text-brand">Lupa Kata Sandi</h1>
      </header>
      <div className="flex justify-center px-6 py-4">
        <img src={forgotImg} alt="" width={1024} height={1024} className="max-h-[34dvh] w-auto object-contain" />
      </div>
      <form
        onSubmit={submit}
        noValidate
        className="mx-4 mb-6 mt-auto rounded-3xl bg-gradient-navy p-5 text-navy-foreground shadow-card"
      >
        <p className="text-center text-sm text-navy-muted">
          Kami akan mengirimkan tautan untuk mengatur ulang kata sandi ke email Anda.
        </p>
        <Field
          className="mt-5"
          tone="dark"
          label="Email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="Masukkan email kamu"
          icon={<Mail />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
        />
        <Button type="submit" variant="cta" size="xl" className="mt-5" disabled={loading}>
          {loading && <Loader2 className="animate-spin" />} Kirim Tautan Reset
        </Button>
        <p className="mt-4 text-center text-sm text-navy-muted">
          Kembali ke halaman{" "}
          <Link to="/login" className="font-semibold text-cyan">
            Masuk
          </Link>
        </p>
      </form>

      <Modal
        open={sent}
        onOpenChange={(o) => !o && setSent(false)}
        title="Tautan Reset Terkirim!"
        image={<img src={mailImg} alt="" width={1024} height={1024} className="size-24 object-contain" />}
        description={
          <>
            <p>Kami telah mengirimkan tautan untuk mengatur ulang kata sandi ke:</p>
            <p className="mt-3 flex items-center justify-center gap-2 break-all rounded-xl border border-border bg-muted px-3 py-2.5 font-medium text-foreground">
              <Mail className="size-4 shrink-0 text-brand" /> {email}
            </p>
            <p className="mt-3 text-xs">Mode simulasi: belum ada email yang dikirim.</p>
          </>
        }
      >
        <Button variant="cta" size="xl" onClick={() => navigate({ to: "/login" })}>
          Oke, Mengerti
        </Button>
      </Modal>
    </main>
  );
}
