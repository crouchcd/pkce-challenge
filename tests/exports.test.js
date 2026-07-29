import { build } from "esbuild";

async function resolvedInputs(conditions) {
  const result = await build({
    stdin: {
      contents: 'import pkceChallenge from "pkce-challenge"; pkceChallenge;',
      resolveDir: process.cwd(),
      sourcefile: "entry.js",
    },
    bundle: true,
    platform: "neutral",
    conditions,
    write: false,
    metafile: true,
    logLevel: "silent",
  });

  return Object.keys(result.metafile.inputs);
}

test.each([
  ["workerd", ["workerd"]],
  ["default", []],
])("resolves the %s condition to the Web Crypto build", async (_, conditions) => {
  await expect(resolvedInputs(conditions)).resolves.toContain(
    "dist/index.browser.js",
  );
});
