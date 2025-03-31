const pkceChallenge = require("../dist/index.node.cjs");
const { verifyChallenge, generateChallenge } = pkceChallenge;

describe("Environment", () => {
  console.log(process.version);
  console.log("crypto", global.crypto && global.crypto.webcrypto);
});

test("default verifier length is 43", async () => {
  expect((await pkceChallenge.default()).code_verifier.length).toBe(43);
});

test("code_verifier pattern matches", async () => {
  const pattern = /^[A-Za-z\d\-._~]{43,128}$/;
  const challengePair = await pkceChallenge.default(128);

  expect(challengePair.code_verifier).toMatch(pattern);
});

test("code_challenge pattern doesn't have [=+/]", async () => {
  const challengePair = await pkceChallenge.default(128);

  expect(challengePair.code_challenge).not.toMatch("=");
  expect(challengePair.code_challenge).not.toMatch("+");
  expect(challengePair.code_challenge).not.toMatch("/");
});

test("verifier length < 43 throws error", async () => {
  await expect(pkceChallenge.default(42)).rejects.toStrictEqual(
    "Expected a length between 43 and 128. Received 42."
  );
});

test("verifier length > 128 throws error", async () => {
  await expect(pkceChallenge.default(129)).rejects.toStrictEqual(
    "Expected a length between 43 and 128. Received 129."
  );
});

test("verifyChallenge should return true", async () => {
  const challengePair = await pkceChallenge.default();
  expect(
    await verifyChallenge(
      challengePair.code_verifier,
      challengePair.code_challenge
    )
  ).toBe(true);
});

test("verifyChallenge should return false", async () => {
  const challengePair = await pkceChallenge.default();
  expect(
    await verifyChallenge(
      challengePair.code_verifier,
      challengePair.code_challenge + "a"
    )
  ).toBe(false);
});

test("generateChallenge should create a consistent challenge from a code_verifier", async () => {
  const challengePair = await pkceChallenge.default();
  const code_challenge = await generateChallenge(challengePair.code_verifier);
  expect(code_challenge).toBe(challengePair.code_challenge);
});
