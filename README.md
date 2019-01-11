# pkce-challenge
Generate a Proof Key for Code Exchange (PKCE).

Read more about the PKCE: [https://www.oauth.com/oauth2-servers/pkce/authorization-request/](https://www.oauth.com/oauth2-servers/pkce/authorization-request/)

`npm install pkce-challenge`


```
> require('pkce-challenge')()
{ code_verifier: 'u1ta-MQ0e7TcpHjgz33M2DcBnOQu~aMGxuiZt0QMD1C',
  code_challenge: 'CUZX5qE8Wvye6kS_SasIsa8MMxacJftmWdsIA_iKp3I' }
```

Specify a length for the code_verifier. The default length is **43**.
```
> require('pkce-challenge')(128)
{ code_verifier:
   'nI1NaT05Hs~bddEOw8RGT-GA4 ... 5_MN.tFwmQIjp7ZTkGWd5PyromAS89jif',
  code_challenge: '_RhcsOODQ3Nz32p3uf5h3geVWavRAjKwC1dMfYzviko' }
```

Use the utilities separately
```
> const verifier = require('pkce-challenge').generateVerifier(43);
> verifier
'GB2NJDiAj9fLOd2tLsI_RgSzZzPahjpp5fVS9.iVvmD'
> require('pkce-challenge').generateChallenge(verifier);
'4-3NioYzK9HO7uhubCxaSFp6tKg0pijyuMcGAwHm9bA'
```
