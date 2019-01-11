# pkce-challenge
Generate a Proof Key for Code Exchange (PKCE).

Read more about the PKCE: [https://www.oauth.com/oauth2-servers/pkce/authorization-request/](https://www.oauth.com/oauth2-servers/pkce/authorization-request/)

`npm install pkce-challenge`


```
const pkceChallenge = require('pkce-challenge');
console.log(pkceChallenge());

// => { code_verifier: 'mMv2NSMzvx_E.DWMP4ryxVaj09fvUUL_apJlTQJL227', 
  code_challenge: 'uqjqe3UgvKzL7_1qmNhfnyhyhifV5LwAOzVJdvPzzdE' }
```

Specify a length for the code_verifier. The default length is **43**.
```
console.log(pkceChallenge(128));

// => { code_verifier: 'bwHwsauYocLGJ.uJ4Q7HD7NB8X4U45a ... DhwNmAlB2Tm',
  code_challenge: 'JJwmL5KZ2w9eJScu_Hx9roz2Aio8RrdpyP4I9zs3Ezw' }
```
