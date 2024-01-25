import * as pkce from "../dist/index.browser";

async function App() {
  const results = await pkce.default();
  const pkceChallengeEl = document.getElementById("pkceChallenge");
  pkceChallengeEl.innerText = JSON.stringify(results, null, 2);

  const verifyChallengeEl = document.getElementById("verifyChallenge");
  const isVerified = await pkce.verifyChallenge(
    results.code_verifier,
    results.code_challenge
  );
  verifyChallengeEl.innerText = isVerified;

  const generateChallengeEl = document.getElementById("generateChallenge");
  const challenge = await pkce.generateChallenge(results.code_verifier);
  generateChallengeEl.innerText = challenge;

  generateChallengeEl.innerText += `, ${challenge === results.code_challenge}`;
}

App();
