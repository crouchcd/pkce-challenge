import { randomBytes, createHash } from "crypto";
import { randomFrom, base64UrlEncode } from "./utils";

/** Generate a PKCE challenge verifier
 * @param length Length of the verifier
 * @returns A random verifier `length` characters long
 */
function generateVerifier(length: number): string {
  return randomFrom(randomBytes, length);
}

/** Generate a PKCE challenge code from a verifier
 * @param code_verifier
 * @returns The base64 url encoded code challenge
 */
export function generateChallenge(code_verifier: string): string {
  const hash = createHash("sha256").update(code_verifier).digest("base64");
  return base64UrlEncode(hash);
}

/** Generate a PKCE challenge pair
 * @param length Length of the verifer (between 43-128)
 * @returns PKCE challenge pair
 */
export default function pkceChallenge(length: number = 43): {
  code_challenge: string;
  code_verifier: string;
} {
  if (length < 43 || length > 128) {
    throw `Expected a length between 43 and 128. Received ${length}.`;
  }

  const verifier = generateVerifier(length);
  const challenge = generateChallenge(verifier);

  return {
    code_challenge: challenge,
    code_verifier: verifier,
  };
}

/** Verify that a code_verifier produces the expected code challenge
 * @param code_verifier
 * @param expectedChallenge The code challenge to verify
 * @returns True if challenges are equal. False otherwise.
 */
export function verifyChallenge(
  code_verifier: string,
  expectedChallenge: string
): boolean {
  const actualChallenge = generateChallenge(code_verifier);
  return actualChallenge === expectedChallenge;
}
