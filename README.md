# pkce-challenge

Generate or verify a Proof Key for Code Exchange (PKCE) challenge pair.

Read more about [PKCE](https://www.oauth.com/oauth2-servers/pkce/authorization-request/).

## Installation

```bash
npm install pkce-challenge
```

## Usage

Default length for the verifier is 43

```js
import pkceChallenge from "pkce-challenge";

await pkceChallenge();
```

gives something like:

```js
{
    code_verifier: 'u1ta-MQ0e7TcpHjgz33M2DcBnOQu~aMGxuiZt0QMD1C',
    code_challenge: 'CUZX5qE8Wvye6kS_SasIsa8MMxacJftmWdsIA_iKp3I',
    code_challenge_method: 'S256'
}
```

### Specify a verifier length

```js
const challenge = await pkceChallenge(128);

challenge.code_verifier.length === 128; // true
```

### Specify a challenge method

The library supports two challenge methods:
- `S256` (default): SHA-256 hashing
- `plain`: No hashing (verifier equals challenge)

```js
// Use S256 method (default)
const challenge = await pkceChallenge(43, "S256");
challenge.code_challenge_method === "S256"; // true

// Use plain method
const plainChallenge = await pkceChallenge(43, "plain");
plainChallenge.code_challenge_method === "plain"; // true
plainChallenge.code_challenge === plainChallenge.code_verifier; // true
```

### Challenge verification

```js
import { verifyChallenge } from "pkce-challenge";

(await verifyChallenge(challenge.code_verifier, challenge.code_challenge)) ===
  true; // true

// Verify with specific method
(await verifyChallenge(
  challenge.code_verifier,
  challenge.code_challenge,
  "S256"
)) === true; // true
```

### Challenge generation from existing code verifier

```js
import { generateChallenge } from "pkce-challenge";

(await generateChallenge(challenge.code_verifier)) === challenge.code_challenge; // true

// Generate with specific method
(await generateChallenge(challenge.code_verifier, "S256")) ===
  challenge.code_challenge; // true
```
