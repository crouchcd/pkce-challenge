import libWordArray from "crypto-js/lib-typedarrays.js";
import SHA256 from "crypto-js/sha256.js";
import encBase64url from "crypto-js/enc-base64url.js";

/**
 * Thanks to @SEIAROTg on stackoverflow:
 * "Convert a 32bit integer into 4 bytes of data in javascript"
 * @param num The 32bit integer
 * @returns An ArrayBuffer representing 4 bytes of binary data
 */
function toBytesInt32(num: number) {
  const arr = new ArrayBuffer(4); // an Int32 takes 4 bytes
  const view = new DataView(arr);
  view.setUint32(0, num, false); // byteOffset = 0; litteEndian = false
  return arr;
}

/**
 * Creates an array of length `size` of random bytes
 * @param size
 * @returns Array of random ints (0 to 255)
 */
function getRandomValues(size: number) {
  const randoms = libWordArray.random(size);
  const randoms1byte: number[] = [];

  randoms.words.forEach((word) => {
    const arr = toBytesInt32(word);
    const fourByteWord = new Uint8Array(arr);
    for (let i = 0; i < 4; i++) {
      randoms1byte.push(fourByteWord[i]);
    }
  });

  return randoms1byte;
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
export function generateChallenge(code_verifier: string) {
  return SHA256(code_verifier).toString(encBase64url);
}

/** Generate a PKCE challenge pair
 * @param length Length of the verifer (between 43-128). Defaults to 43.
 * @returns PKCE challenge pair
 */
export default function pkceChallenge(length?: number): {
  code_verifier: string;
  code_challenge: string;
} {
  if (!length) length = 43;

  if (length < 43 || length > 128) {
    throw `Expected a length between 43 and 128. Received ${length}.`;
  }

  const verifier = generateVerifier(length);
  const challenge = generateChallenge(verifier);

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
export function verifyChallenge(
  code_verifier: string,
  expectedChallenge: string
) {
  const actualChallenge = generateChallenge(code_verifier);
  return actualChallenge === expectedChallenge;
}
