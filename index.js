const { createHash, randomBytes } = require("crypto");

/** Generate cryptographically secure random string
 * @param {number} size The desired length of the string
 * @param {string} mask A mask of characters (no more than 256) to choose from
 * @returns {string} The random string
 */
function random(size, mask) {
  let result = "";
  const randomIndices = randomBytes(size);
  const byteLength = Math.pow(2, 8); // 256
  const maskLength = Math.min(mask.length, byteLength);
  // the scaling factor breaks down the possible values of bytes (0x00-0xFF)
  // into the range of mask indices
  const scalingFactor = byteLength / maskLength;
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(randomIndices[i] / scalingFactor);
    result += mask[randomIndex];
  }
  return result;
}

/** Base64 url encode a string
 * @param {string} base64 The base64 string to url encode
 * @returns {string} The base64 url encoded string
 */
function base64UrlEncode(base64) {
  return base64
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

/** Generate a PKCE challenge verifier
 * @param {number} length Length of the verifier
 * @returns {string} A random verifier `length` characters long
 */
function generateVerifier(length) {
  const mask =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~";
  return random(length, mask);
}

/** Generate a PKCE challenge code from a verifier
 * @param {string} code_verifier
 * @returns {string} The base64 url encoded code challenge
 */
function generateChallenge(code_verifier) {
  const hash = createHash("sha256")
    .update(code_verifier)
    .digest("base64");
  return base64UrlEncode(hash);
}

/** Generate a PKCE challenge pair
 * @param {number} [length=43] Length of the verifer (between 43-128)
 * @returns {{code_challenge:string,code_verifier:string}} PKCE challenge pair
 */
function pkceChallenge(length) {
  if (!length) length = 43;

  if (length < 43 || length > 128) {
    throw `Expected a length between 43 and 128. Received ${length}.`;
  }

  const verifier = generateVerifier(length);
  const challenge = generateChallenge(verifier);

  return {
    code_challenge: challenge,
    code_verifier: verifier
  };
}

module.exports = pkceChallenge;

/** Verify that a code_verifier produces the expected code challenge
 * @param {string} code_verifier
 * @param {string} expectedChallenge The code challenge to verify
 * @returns {boolean} True if challenges are equal. False otherwise.
 */
function verifyChallenge(code_verifier, expectedChallenge) {
  const actualChallenge = generateChallenge(code_verifier);
  return actualChallenge === expectedChallenge;
}

module.exports.verifyChallenge = verifyChallenge;
