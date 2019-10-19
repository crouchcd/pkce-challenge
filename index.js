const { createHash, randomBytes } = require('crypto');

/**
 * generate cryptographically secure random string
 * @param {number} size how long the result should be
 * @param {string} mask string to select chars from
 */
function random(size, mask) {
    let result = '';
    const byteLength = Math.pow(2, 8);
    if (mask.length > byteLength) {
        const howManySkipped = mask.length - byteLength;
        console.warn(
            `Mask is longer than 2^8. Last ${howManySkipped} items will be skipped.`
        );
    }
    const subscrValues = randomBytes(size);
    const maxMaskLength = Math.min(mask.length, byteLength);
    // subscript values range from 0 to 0xFF = 256
    // mask subscripts range from 0 to (maxMaskLength-1) = maxMaskLength
    const scalingValue = byteLength / maxMaskLength;

    for (let i = 0; i < size; i++) {
        const randIdx = Math.floor(subscrValues[i] / scalingValue);
        result += mask[randIdx];
    }

    return result;
}
/**
 * @param {string} base64 base64 encoded string to url encode
 * @returns {string} base64 url encoded string
 */
function base64UrlEncode(base64) {
    return base64
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}
/**
 * generate a pkce challenge verifier
 * @param {number} length length of the verifier
 * @returns {string} random string `length` characters long
 */
function generateVerifier(length) {
    const mask = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~';
    return random(length, mask);
}
/**
 * generate a pkce challenge code from a verifier
 * @param {string} code_verifier base64 url encoded string
 */
function generateChallenge(code_verifier) {
    const hash = createHash('sha256')
        .update(code_verifier)
        .digest('base64');
    return base64UrlEncode(hash);
}
/**
 * generate a pkce challenge pair
 * @param {number} [length=43] specify the length of
 * the verifier between 43 and 123 characters long
 * @returns {{code_challenge:string,
 * code_verifier:string}} pkce challenge pair
 */
function pkceChallenge(length = 43) {
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