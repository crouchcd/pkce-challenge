const { createHash } = require('crypto');
const radomatic = require('randomatic');
const { fromBase64 } = require('base64url');

function generateVerifier(length) {
    return radomatic('Aa0?', length, { chars: '-._~' });
}

function generateChallenge(code_verifier) {
    const hash = createHash('sha256')
        .update(code_verifier)
        .digest('base64');
    return fromBase64(hash);
}

module.exports = function generatePKCE(length = 43) {
    const code_verifier = generateVerifier(length);
    return {
        code_verifier,
        code_challenge: generateChallenge(code_verifier)
    }
};
module.exports.generateVerifier = generateVerifier;
module.exports.generateChallenge = generateChallenge;
