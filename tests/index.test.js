import pkceChallenge, { verifyChallenge, generateChallenge } from "../dist/index";

test("default verifier length is 43", async () => {
  expect((await pkceChallenge()).code_verifier.length).toBe(43);
});

test("code_verifier pattern matches", async () => {
  const pattern = /^[A-Za-z\d\-._~]{43,128}$/;
  const challengePair = await pkceChallenge(128);

  expect(challengePair.code_verifier).toMatch(pattern);
});

test("code_challenge pattern doesn't have [=+/]", async () => {
  const challengePair = await pkceChallenge(128);

  expect(challengePair.code_challenge).not.toMatch("=");
  expect(challengePair.code_challenge).not.toMatch("+");
  expect(challengePair.code_challenge).not.toMatch("/");
});

test("verifier length < 43 throws error", async () => {
  await expect(
    pkceChallenge(42)
  ).rejects.toStrictEqual("Expected a length between 43 and 128. Received 42.");
});

test("verifier length > 128 throws error", async () => {
  await expect(
    pkceChallenge(129)
  ).rejects.toStrictEqual("Expected a length between 43 and 128. Received 129.");
});

test("verifyChallenge should return true", async () => {
  const challengePair = await pkceChallenge();
  expect(
    await verifyChallenge(challengePair.code_verifier, challengePair.code_challenge)
  ).toBe(true);
});

test("verifyChallenge should return false", async () => {
  const challengePair = await pkceChallenge();
  expect(
    await verifyChallenge(
      challengePair.code_verifier,
      challengePair.code_challenge + "a"
    )
  ).toBe(false);
});

test("generateChallenge should create a consistent challenge from a code_verifier", async () => {
  const challengePair = await pkceChallenge();
  const code_challenge = await generateChallenge(challengePair.code_verifier);
  expect(code_challenge).toBe(challengePair.code_challenge);
});
