import type { webcrypto } from 'node:crypto';

let crypto: webcrypto.Crypto | null = null;

/**
 * Ensures that `crypto` is initialized properly based on the environment.
 */
async function getCrypto(): Promise<webcrypto.Crypto> {
  if (!crypto) {
    if (typeof globalThis.crypto !== "undefined" && globalThis.crypto.subtle) {
      crypto = globalThis.crypto; // Browser or Node.js 18+
    } else {
      const { webcrypto } = await import("node:crypto");
      crypto = webcrypto; // Node.js 16 non-REPL
    }
  }
  return crypto;
}

/**
 * Creates an array of length `size` of random bytes.
 * @param size
 * @returns Array of random ints (0 to 255)
 */
async function getRandomValues(size: number) {
  const crypto = await getCrypto();
  return crypto.getRandomValues(new Uint8Array(size));
}

/** Generate cryptographically strong random string.
 * @param size The desired length of the string.
 * @returns The random string.
 */
async function random(size: number) {
  const mask =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~";
  let result = "";
  const randomUints = await getRandomValues(size);
  for (let i = 0; i < size; i++) {
    const randomIndex = randomUints[i] % mask.length;
    result += mask[randomIndex];
  }
  return result;
}

/** Generate a PKCE challenge verifier.
 * @param length Length of the verifier.
 * @returns A random verifier `length` characters long.
 */
async function generateVerifier(length: number): Promise<string> {
  return random(length);
}

/** Generate a PKCE code challenge from a code verifier.
 * @param code_verifier
 * @returns The base64 URL-encoded code challenge.
 */
export async function generateChallenge(code_verifier: string) {
  const crypto = await getCrypto();
  const buffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(code_verifier)
  );
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\//g, '_')
    .replace(/\+/g, '-')
    .replace(/=/g, '');
}

/** Generate a PKCE challenge pair.
 * @param length Length of the verifier (between 43-128). Defaults to 43.
 * @returns PKCE challenge pair.
 */
export default async function pkceChallenge(length?: number): Promise<{
  code_verifier: string;
  code_challenge: string;
}> {
  if (!length) length = 43;

  if (length < 43 || length > 128) {
    throw new Error(`Expected a length between 43 and 128. Received ${length}.`);
  }

  const verifier = await generateVerifier(length);
  const challenge = await generateChallenge(verifier);

  return {
    code_verifier: verifier,
    code_challenge: challenge,
  };
}

/** Verify that a code_verifier produces the expected code challenge.
 * @param code_verifier
 * @param expectedChallenge The code challenge to verify.
 * @returns True if challenges are equal. False otherwise.
 */
export async function verifyChallenge(
  code_verifier: string,
  expectedChallenge: string
) {
  const actualChallenge = await generateChallenge(code_verifier);
  return actualChallenge === expectedChallenge;
}
