import pkceChallengeDefault from "../dist/module";
import * as pkceChallengeStar from "../dist/module";
import { default as pkceChallengeDefaultAliased } from "../dist/module";

describe("import default", () => {
  it("should be a function", () => {
    expect(typeof pkceChallengeDefault).toBe("function");
  });
});

describe("import star", () => {
  it("should be an object", () => {
    expect(typeof pkceChallengeStar).toBe("object");
    expect(pkceChallengeStar).toHaveProperty("default");
    expect(pkceChallengeStar).toHaveProperty("generateChallenge");
    expect(pkceChallengeStar).toHaveProperty("verifyChallenge");
  });
});

describe("default aliased", () => {
  it("should be a function", () => {
    expect(typeof pkceChallengeDefaultAliased).toBe("function");
  });
});
