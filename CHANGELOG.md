# Changelog

## [3.0.0] - 2022-03-28

- feat!: depend on crypto-js for node/browser compatibility. Using Typescript with Parcel.

```js
// commonjs
const pkceChallenge = require("pkce-challenge").default;

// es modules
import pkceChallenge from "pkce-challenge";
```

## [2.2.0] - 2021-05-19

### Added

- `generateChallenge` exported from index

### Contributors

- [SeyyedKhandon]

## [2.1.0] - 2019-12-20

### Added

- `verifyChallenge` exported from index

### Changed

- code/comment formatting
- refactored `random` function

## [2.0.0] - 2019-10-18

### Added

- CHANGELOG
- typescript definition
- Cryptographically secured method for generating code verifier
- Method for base64 url encoding

### Removed

- `generateVerifier` export from index
- `generateChallenge` export from index
- `base64url` npm dependency
- `randomatic` npm dependency

### Contributors

- [lordnox]

[seyyedkhandon]: https://github.com/SeyyedKhandon
[lordnox]: https://github.com/lordnox
[3.0.0]: https://github.com/crouchcd/pkce-challenge/releases/tag/3.0.0
[2.2.0]: https://github.com/crouchcd/pkce-challenge/releases/tag/2.2.0
[2.1.0]: https://github.com/crouchcd/pkce-challenge/releases/tag/2.1.0
[2.0.0]: https://github.com/crouchcd/pkce-challenge/releases/tag/2.0.0
