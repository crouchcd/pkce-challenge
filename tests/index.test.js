const { test } = require("tap");
const pkceChallenge = require("../index");
const { verifyChallenge, generateChallenge } = pkceChallenge;

test("default verifier length is 43", (t) => {
  t.is(pkceChallenge().code_verifier.length, 43);
  t.end();
});

test("code_verifier pattern matches", (t) => {
  const pattern = /^[A-Za-z\d\-._~]{43,128}$/;
  const challengePair = pkceChallenge(128);

  t.match(challengePair.code_verifier, pattern);
  t.end();
});

test("code_challenge pattern doesn't have [=+/]", (t) => {
  const challengePair = pkceChallenge(128);

  t.doesNotHave(challengePair.code_challenge, "=");
  t.doesNotHave(challengePair.code_challenge, "+");
  t.doesNotHave(challengePair.code_challenge, "/");
  t.end();
});

test("verifier length < 43 throws error", (t) => {
  t.throws(() => {
    pkceChallenge(42);
  }, "Expected a length between 43 and 128. Received 42.");
  t.end();
});

test("verifier length > 128 throws error", (t) => {
  t.throws(() => {
    pkceChallenge(129);
  }, "Expected a length between 43 and 128. Received 129.");
  t.end();
});

test("verifyChallenge should return true", (t) => {
  const challengePair = pkceChallenge();
  t.is(
    verifyChallenge(challengePair.code_verifier, challengePair.code_challenge),
    true
  );
  t.end();
});

test("verifyChallenge should return false", (t) => {
  const challengePair = pkceChallenge();
  t.is(
    verifyChallenge(
      challengePair.code_verifier,
      challengePair.code_challenge + "a"
    ),
    false
  );
  t.end();
});

test("generateChallenge should create a consistent challenge from a code_verifier", (t) => {
  const challengePair = pkceChallenge();
  const code_challenge = generateChallenge(challengePair.code_verifier);
  t.is(code_challenge, challengePair.code_challenge);
  t.end();
});
