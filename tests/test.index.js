const { test } = require('tap');
const generatePKCE = require('../index');

test('min PKCE', (t) => {
    const pkce = generatePKCE();
    t.is(pkce.code_verifier.length, 43);
    t.end();
});
test('max PKCE', (t) => {
    const pkce = generatePKCE(128);
    t.is(pkce.code_verifier.length, 128);
    t.end();
});