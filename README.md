# pkce-challenge

Generate or verify a Proof Key for Code Exchange (PKCE) challenge pair.

Read more about [PKCE](https://www.oauth.com/oauth2-servers/pkce/authorization-request/).

## Installation

```
npm install pkce-challenge
```

## Usage

Default length for the verifier is 43

```
const pkceChallenge = require('pkce-challenge');
pkceChallenge();
```

gives something like:

```
{
    code_verifier: 'u1ta-MQ0e7TcpHjgz33M2DcBnOQu~aMGxuiZt0QMD1C',
    code_challenge: 'CUZX5qE8Wvye6kS_SasIsa8MMxacJftmWdsIA_iKp3I'
}
```

### Specify a verifier length

```
const challenge = pkceChallenge(128);
expect(challenge.code_verifier.length).equals(128);
```

### Challenge verification

```
const {verifyChallenge} = require('pkce-challenge');
expect(
    verifyChallenge(
        challenge.code_verifier,
        challenge.code_challenge
    )
).toBe(true);
```
