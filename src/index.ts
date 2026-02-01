import type { webcrypto } from "node:crypto";

let crypto: webcrypto.Crypto | Promise<webcrypto.Crypto>;

// diverge:if env=browser
crypto = globalThis.crypto as webcrypto.Crypto; // web browsers
// diverge:else
crypto =
  (globalThis.crypto as any)?.webcrypto ?? // Node.js [18-16] REPL
  globalThis.crypto ?? // Node.js >18
  import("node:crypto").then((m) => m.webcrypto); // Node.js <18 Non-REPL
// diverge:fi

/** PKCE challenge method types */
export type PKCEChallengeMethod = "S256" | "plain";

/**
 * Creates an array of length `size` of random bytes
 * @param size
 * @returns Array of random ints (0 to 255)
 */
async function getRandomValues(size: number) {
  return (await crypto).getRandomValues(new Uint8Array(size));
}

/**
 * Base64url-encode octets per RFC 7636 Appendix A
 * @param buffer The octets to encode
 * @returns Base64url encoded string without padding
 */
function base64urlEncode(buffer: ArrayBuffer): string {
  // btoa is deprecated in Node.js but is used here for web browser compatibility
  // (which has no good replacement yet, see also https://github.com/whatwg/html/issues/6811)
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

/** Generate a PKCE challenge verifier
 * @param length Length of the verifier (43-128 characters)
 * @returns A random verifier `length` characters long
 */
async function generateVerifier(length: number): Promise<string> {
  // Per RFC 7636 Section 4.1: recommended approach is to generate random octets
  // and base64url-encode them. Base64url encoding produces 4 characters per 3 octets.
  // Calculate octets needed: we need ceil(length * 3 / 4) octets to get at least
  // `length` characters after encoding
  const octetSize = Math.ceil((length * 3) / 4);
  const octets = await getRandomValues(octetSize);
  const encoded = base64urlEncode(octets.buffer);

  // Trim to exact length requested (base64url encoding may produce slightly more)
  return encoded.slice(0, length);
}

/** Generate a PKCE code challenge from a code verifier
 * @param code_verifier base64url encoded code verifier
 * @param method The challenge method to use (defaults to "S256")
 * @returns The base64 url encoded code challenge (or plain verifier if method is "plain")
 */
export async function generateChallenge(
  code_verifier: string,
  method: PKCEChallengeMethod = "S256",
) {
  if (method === "plain") {
    return code_verifier;
  }
  if (method !== "S256") {
    throw new Error(`Unsupported PKCE challenge method: ${method}`);
  }

  const buffer = await (
    await crypto
  ).subtle.digest("SHA-256", new TextEncoder().encode(code_verifier));

  return base64urlEncode(buffer);
}

/** Generate a PKCE challenge pair
 * @param length Length of the verifer (between 43-128). Defaults to 43.
 * @param method The challenge method to use. Defaults to "S256".
 * @returns PKCE challenge pair
 */
export default async function pkceChallenge(
  length?: number,
  method?: PKCEChallengeMethod,
): Promise<{
  code_verifier: string;
  code_challenge: string;
  code_challenge_method: PKCEChallengeMethod;
}> {
  if (!length) length = 43;
  if (!method) method = "S256";

  if (length < 43 || length > 128) {
    throw new Error(
      `Expected a length between 43 and 128. Received ${length}.`,
    );
  }

  const verifier = await generateVerifier(length);
  const challenge = await generateChallenge(verifier, method);

  return {
    code_verifier: verifier,
    code_challenge: challenge,
    code_challenge_method: method,
  };
}

/** Verify that a code_verifier produces the expected code challenge
 * @param code_verifier
 * @param expectedChallenge The code challenge to verify
 * @param method The challenge method used (defaults to "S256")
 * @returns True if challenges are equal. False otherwise.
 */
export async function verifyChallenge(
  code_verifier: string,
  expectedChallenge: string,
  method: PKCEChallengeMethod = "S256",
) {
  const actualChallenge = await generateChallenge(code_verifier, method);
  return actualChallenge === expectedChallenge;
}
