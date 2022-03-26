/** Generate cryptographically strong random string
 * @param randomFn The method to call for generating random bytes
 * @param size The desired length of the string
 * @returns The random string
 */
export function randomFrom(
  randomFn: (size: number) => Uint8Array | Buffer,
  size: number
): string {
  const mask =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~";
  let result = "";
  const randomUints = randomFn(size);
  for (let i = 0; i < size; i++) {
    // cap the value of the randomIndex to mask.length - 1
    const randomIndex = randomUints[i] % mask.length;
    result += mask[randomIndex];
  }
  return result;
}

/** Base64 url encode a string
 * @param base64str The base64 string to url encode
 * @returns The base64 url encoded string
 */
export function base64UrlEncode(base64str: string): string {
  return base64str.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
