const ONBOARD_KEY = "hireloop.onboarding.done";

export function isOnboardingDone(): boolean {
  try {
    return localStorage.getItem(ONBOARD_KEY) === "1";
  } catch {
    return false;
  }
}
export function markOnboardingDone() {
  try {
    localStorage.setItem(ONBOARD_KEY, "1");
  } catch {
    /* ignore */
  }
}

/** Data pendaftaran sementara di memori (tanpa password). */
type Draft = { firstName: string; lastName: string; email: string; phone: string };
let registerDraft: Draft | null = null;
let prefillLoginEmail = "";

export const memoryStore = {
  getDraft: () => registerDraft,
  setDraft: (d: Draft | null) => (registerDraft = d),
  takeLoginEmail: () => {
    const v = prefillLoginEmail;
    prefillLoginEmail = "";
    return v;
  },
  setLoginEmail: (v: string) => (prefillLoginEmail = v),
};
