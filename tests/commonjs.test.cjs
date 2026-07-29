const pkceChallenge = require("pkce-challenge");
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
  await expect(pkceChallenge.default(42)).rejects.toThrow(
    "Expected a length between 43 and 128. Received 42."
  );
});

test("verifier length > 128 throws error", async () => {
  await expect(pkceChallenge.default(129)).rejects.toThrow(
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

test("default challenge method is S256", async () => {
  const challengePair = await pkceChallenge.default();
  expect(challengePair.code_challenge_method).toBe("S256");
});

test("can specify S256 challenge method", async () => {
  const challengePair = await pkceChallenge.default(43, "S256");
  expect(challengePair.code_challenge_method).toBe("S256");
  expect(challengePair.code_challenge).not.toBe(challengePair.code_verifier);
});

test("can specify plain challenge method", async () => {
  const challengePair = await pkceChallenge.default(43, "plain");
  expect(challengePair.code_challenge_method).toBe("plain");
  expect(challengePair.code_challenge).toBe(challengePair.code_verifier);
});

test("plain method returns verifier as challenge", async () => {
  const code_verifier = "test_verifier_with_correct_length_for_plain";
  const code_challenge = await generateChallenge(code_verifier, "plain");
  expect(code_challenge).toBe(code_verifier);
});

test("S256 method returns hashed challenge", async () => {
  const code_verifier = "test_verifier_with_correct_length_for_hash";
  const code_challenge = await generateChallenge(code_verifier, "S256");
  expect(code_challenge).not.toBe(code_verifier);
  expect(code_challenge.length).toBeGreaterThan(0);
});

test("verifyChallenge works with plain method", async () => {
  const challengePair = await pkceChallenge.default(43, "plain");
  expect(
    await verifyChallenge(
      challengePair.code_verifier,
      challengePair.code_challenge,
      "plain"
    )
  ).toBe(true);
});

test("verifyChallenge works with S256 method", async () => {
  const challengePair = await pkceChallenge.default(43, "S256");
  expect(
    await verifyChallenge(
      challengePair.code_verifier,
      challengePair.code_challenge,
      "S256"
    )
  ).toBe(true);
});

test("verifyChallenge fails when wrong method is used", async () => {
  const challengePair = await pkceChallenge.default(43, "S256");
  expect(
    await verifyChallenge(
      challengePair.code_verifier,
      challengePair.code_challenge,
      "plain"
    )
  ).toBe(false);
});

test("generateChallenge throws error for unsupported method", async () => {
  const code_verifier = "test_verifier_with_correct_length_for_test";
  await expect(generateChallenge(code_verifier, "invalid")).rejects.toThrow(
    "Unsupported PKCE challenge method: invalid"
  );
});

test("verifyChallenge throws error for unsupported method", async () => {
  const challengePair = await pkceChallenge.default();
  await expect(
    verifyChallenge(
      challengePair.code_verifier,
      challengePair.code_challenge,
      "invalid"
    )
  ).rejects.toThrow("Unsupported PKCE challenge method: invalid");
});
