const DEFAULT_LENGTH = 22;

function getCrypto(): Crypto {
  const c = (globalThis as any).crypto as Crypto | undefined;
  if (c && typeof c.getRandomValues === "function") return c;
  try {
    const req = Function("return typeof require===\"function\"?require:null")() as any;
    const nodeCrypto = req && req("node:crypto");
    const wc = nodeCrypto && nodeCrypto.webcrypto;
    if (wc && typeof wc.getRandomValues === "function") return wc as Crypto;
  } catch {}
  throw new Error("Web Crypto API unavailable");
}

function toBase64Url(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  const btoaFn = (globalThis as any).btoa as ((data: string) => string) | undefined;
  const base64 = typeof btoaFn === "function"
    ? btoaFn(bin)
    : (globalThis as any).Buffer.from(bytes).toString("base64");
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function bytesForLength(len: number): number {
  const n = Math.max(1, len | 0);
  return Math.ceil((n * 3) / 4);
}

export function uniqueString(length = DEFAULT_LENGTH): string {
  const crypto = getCrypto();
  const bytes = new Uint8Array(bytesForLength(length));
  crypto.getRandomValues(bytes);
  const s = toBase64Url(bytes);
  return s.length >= length ? s.slice(0, length) : s;
}

export async function uniqueStringAsync(length = DEFAULT_LENGTH): Promise<string> {
  return uniqueString(length);
}

export default uniqueString;
