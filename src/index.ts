import type { webcrypto } from 'node:crypto';

const crypto: webcrypto.Crypto =
  globalThis.crypto?.webcrypto ?? // Node.js 16 REPL has globalThis.crypto as node:crypto
  globalThis.crypto ?? // web browsers and Node.js 18+ 
  (await import("node:crypto")).webcrypto; // Node.js 16 non-REPL

/**
 * Creates an array of length `size` of random bytes
 * @param size
 * @returns Array of random ints (0 to 255)
 */
function getRandomValues(size: number) {
  return crypto.getRandomValues(new Uint8Array(size));
}

/** Generate cryptographically strong random string
 * @param size The desired length of the string
 * @returns The random string
 */
function random(size: number) {
  const mask =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~";
  let result = "";
  const randomUints = getRandomValues(size);
  for (let i = 0; i < size; i++) {
    // cap the value of the randomIndex to mask.length - 1
    const randomIndex = randomUints[i] % mask.length;
    result += mask[randomIndex];
  }
  return result;
}

/** Generate a PKCE challenge verifier
 * @param length Length of the verifier
 * @returns A random verifier `length` characters long
 */
function generateVerifier(length: number): string {
  return random(length);
}

/** Generate a PKCE code challenge from a code verifier
 * @param code_verifier
 * @returns The base64 url encoded code challenge
 */
export async function generateChallenge(code_verifier: string) {
  const buffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(code_verifier)
  );
  // Generate base64url string
  // btoa is deprecated in Node.js but is used here for web browser compatibility
  // (which has no good replacement yet, see also https://github.com/whatwg/html/issues/6811)
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\//g, '_')
    .replace(/\+/g, '-')
    .replace(/=/g, '');
}

/** Generate a PKCE challenge pair
 * @param length Length of the verifer (between 43-128). Defaults to 43.
 * @returns PKCE challenge pair
 */
export default async function pkceChallenge(length?: number): Promise<{
  code_verifier: string;
  code_challenge: string;
}> {
  if (!length) length = 43;

  if (length < 43 || length > 128) {
    throw `Expected a length between 43 and 128. Received ${length}.`;
  }

  const verifier = generateVerifier(length);
  const challenge = await generateChallenge(verifier);

  return {
    code_verifier: verifier,
    code_challenge: challenge,
  };
}

/** Verify that a code_verifier produces the expected code challenge
 * @param code_verifier
 * @param expectedChallenge The code challenge to verify
 * @returns True if challenges are equal. False otherwise.
 */
export async function verifyChallenge(
  code_verifier: string,
  expectedChallenge: string
) {
  const actualChallenge = await generateChallenge(code_verifier);
  return actualChallenge === expectedChallenge;
}
