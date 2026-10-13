// Aturan validasi terpusat — sesuaikan dengan backend nanti.
export const PASSWORD_MIN_LENGTH = 8;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^(?:08\d{8,11}|\+628\d{7,10})$/;

export const isValidEmail = (v: string) => EMAIL_RE.test(v.trim());
export const isValidPhoneID = (v: string) => PHONE_RE.test(v.replace(/[\s-]/g, ""));

export function validateEmail(v: string): string | undefined {
  if (!v.trim()) return "Email wajib diisi";
  if (!isValidEmail(v)) return "Format email tidak valid";
}

export type LoginInput = { email: string; password: string };
export function validateLogin(i: LoginInput) {
  const e: Partial<Record<keyof LoginInput, string>> = {};
  const em = validateEmail(i.email);
  if (em) e.email = em;
  if (!i.password) e.password = "Kata sandi wajib diisi";
  return e;
}

export type RegisterInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};
export function validateRegister(i: RegisterInput) {
  const e: Partial<Record<keyof RegisterInput, string>> = {};
  if (!i.firstName.trim()) e.firstName = "Nama depan wajib diisi";
  const em = validateEmail(i.email);
  if (em) e.email = em;
  if (!i.phone.trim()) e.phone = "Nomor handphone wajib diisi";
  else if (!isValidPhoneID(i.phone)) e.phone = "Gunakan format 08xx atau +62xx";
  if (!i.password) e.password = "Kata sandi wajib diisi";
  else if (i.password.length < PASSWORD_MIN_LENGTH)
    e.password = `Kata sandi minimal ${PASSWORD_MIN_LENGTH} karakter`;
  if (!i.confirmPassword) e.confirmPassword = "Konfirmasi kata sandi wajib diisi";
  else if (i.confirmPassword !== i.password) e.confirmPassword = "Konfirmasi kata sandi tidak cocok";
  return e;
}
