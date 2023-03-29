const pkceChallenge = require("../dist/main").default;
const { verifyChallenge, generateChallenge } = require("../dist/main");

test("default verifier length is 43", () => {
  expect(pkceChallenge().code_verifier.length).toBe(43);
});

test("code_verifier pattern matches", () => {
  const pattern = /^[A-Za-z\d\-._~]{43,128}$/;
  const challengePair = pkceChallenge(128);

  expect(challengePair.code_verifier).toMatch(pattern);
});

test("code_challenge pattern doesn't have [=+/]", () => {
  const challengePair = pkceChallenge(128);

  expect(challengePair.code_challenge).not.toMatch("=");
  expect(challengePair.code_challenge).not.toMatch("+");
  expect(challengePair.code_challenge).not.toMatch("/");
});

test("verifier length < 43 throws error", () => {
  expect(() => {
    pkceChallenge(42);
  }).toThrow("Expected a length between 43 and 128. Received 42.");
});

test("verifier length > 128 throws error", () => {
  expect(() => {
    pkceChallenge(129);
  }).toThrow("Expected a length between 43 and 128. Received 129.");
});

test("verifyChallenge should return true", () => {
  const challengePair = pkceChallenge();
  expect(
    verifyChallenge(challengePair.code_verifier, challengePair.code_challenge)
  ).toBe(true);
});

test("verifyChallenge should return false", () => {
  const challengePair = pkceChallenge();
  expect(
    verifyChallenge(
      challengePair.code_verifier,
      challengePair.code_challenge + "a"
    )
  ).toBe(false);
});

test("generateChallenge should create a consistent challenge from a code_verifier", () => {
  const challengePair = pkceChallenge();
  const code_challenge = generateChallenge(challengePair.code_verifier);
  expect(code_challenge).toBe(challengePair.code_challenge);
});
