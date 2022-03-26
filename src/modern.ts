import { randomFrom, base64UrlEncode } from "./utils";

function randomFn(size: number) {
  const typedArray = new Uint8Array(size);
  return crypto.getRandomValues(typedArray);
}

/** Generate a PKCE challenge verifier
 * @param length Length of the verifier
 * @returns A random verifier `length` characters long
 */
function generateVerifier(length: number): string {
  return randomFrom(randomFn, length);
}

/** Generate a PKCE challenge code from a verifier
 * @param code_verifier
 * @returns The base64 url encoded code challenge
 */
export async function generateChallenge(
  code_verifier: string
): Promise<string> {
  const encoder = new TextEncoder();
  const textUints = encoder.encode(code_verifier);
  const hash = await crypto.subtle.digest("SHA-256", textUints);
  const hashb64 = btoa(String.fromCharCode.apply(null, new Uint8Array(hash)));
  return base64UrlEncode(hashb64);
}

/** Generate a PKCE challenge pair
 * @param length Length of the verifer (between 43-128)
 * @returns PKCE challenge pair
 */
export default async function pkceChallenge(length: number = 43): Promise<{
  code_challenge: string;
  code_verifier: string;
}> {
  if (length < 43 || length > 128) {
    throw `Expected a length between 43 and 128. Received ${length}.`;
  }

  const verifier = generateVerifier(length);
  const challenge = await generateChallenge(verifier);

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
export async function verifyChallenge(
  code_verifier: string,
  expectedChallenge: string
): Promise<boolean> {
  const actualChallenge = await generateChallenge(code_verifier);
  return actualChallenge === expectedChallenge;
}
