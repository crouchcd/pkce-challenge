const { test } = require('tap');
const pkceChallenge = require('../index');

test('default verifier length is 43', t => {
    t.is(pkceChallenge().code_verifier.length, 43);
    t.end();
});
test('code_verifier pattern matches', t => {
    const pattern = /^[A-Za-z\d\-._~]{43,128}$/
    const challengePair = pkceChallenge(128);

    t.match(challengePair.code_verifier, pattern);
    t.end();
});
test("code_challenge pattern doesn't have [=+/]", t => {
    const challengePair = pkceChallenge(128);

    t.doesNotHave(challengePair.code_challenge, '=');
    t.doesNotHave(challengePair.code_challenge, '+');
    t.doesNotHave(challengePair.code_challenge, '/');
    t.end();
});
test('verifier length < 43 throws error', t => {
    t.throws(() => {
        pkceChallenge(42);
    }, 'Expected a length between 43 and 128. Received 42.');
    t.end();
});
test('verifier length > 128 throws error', t => {
    t.throws(() => {
        pkceChallenge(129);
    }, 'Expected a length between 43 and 128. Received 129.');
    t.end();
});