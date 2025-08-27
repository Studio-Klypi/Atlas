export const STRONG_PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{12,}$/;
export const PASSPHRASE_RE = /^(?=\S.{18,126}\S$)(?:\b\w{4,}\b(?:\s+|$)){3,}$/;
