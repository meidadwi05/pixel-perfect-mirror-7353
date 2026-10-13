/**
 * SERVICE SIMULASI — belum terhubung ke API.
 * Ganti isi tiap fungsi dengan panggilan REST ke backend. Tanda tangan fungsi
 * dibuat agar komponen UI tidak perlu diubah.
 * Password dan OTP tidak pernah disimpan ke storage atau log.
 */
import type { RegisterInput } from "@/lib/validation";

export const DEMO_OTP = "123456";
export const OTP_TTL_MS = 5 * 60 * 1000;
export const OTP_RESEND_SECONDS = 60;

const wait = (ms = 900) => new Promise((r) => setTimeout(r, ms));

export async function login(_email: string, _password: string): Promise<{ ok: true }> {
  await wait();
  return { ok: true };
}

export async function requestPasswordReset(_email: string): Promise<{ ok: true }> {
  await wait();
  return { ok: true };
}

export async function register(_input: RegisterInput): Promise<{ ok: true }> {
  await wait(1100);
  return { ok: true };
}

/** Mengembalikan waktu kedaluwarsa OTP (epoch ms). */
export async function sendOtp(_email: string): Promise<{ expiresAt: number }> {
  await wait(500);
  return { expiresAt: Date.now() + OTP_TTL_MS };
}

export type VerifyResult = { ok: true } | { ok: false; reason: "invalid" | "expired" };

export async function verifyOtp(
  _email: string,
  code: string,
  expiresAt: number,
  now: number = Date.now(),
): Promise<VerifyResult> {
  await wait(800);
  return checkOtp(code, expiresAt, now);
}

export function checkOtp(code: string, expiresAt: number, now: number): VerifyResult {
  if (now > expiresAt) return { ok: false, reason: "expired" };
  if (code !== DEMO_OTP) return { ok: false, reason: "invalid" };
  return { ok: true };
}
