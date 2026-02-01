# Changelog

## [6.0.0](https://github.com/crouchcd/pkce-challenge/releases/tag/6.0.0) - 2026-02-01

## Breaking Changes

- `code_challenge_method` is now included in the return type in https://github.com/crouchcd/pkce-challenge/pull/41

## What's Changed

- build(deps-dev): bump qs from 6.14.0 to 6.14.1 in /browser-test by @dependabot[bot] in https://github.com/crouchcd/pkce-challenge/pull/39
- build(deps-dev): bump js-yaml from 3.14.1 to 3.14.2 by @dependabot[bot] in https://github.com/crouchcd/pkce-challenge/pull/36
- Add Cypress e2e tests for browser bundle verification by @Copilot in https://github.com/crouchcd/pkce-challenge/pull/42
- Add code_challenge_method to return type and support configurable PKCE methods by @Copilot in https://github.com/crouchcd/pkce-challenge/pull/41

**Full Changelog**: https://github.com/crouchcd/pkce-challenge/compare/5.0.1...6.0.0

## [5.0.1](https://github.com/crouchcd/pkce-challenge/releases/tag/5.0.1) - 2025-11-22

## What's Changed

- Use even distribution by @RobinVdBroeck in https://github.com/crouchcd/pkce-challenge/pull/38

## New Contributors

- @RobinVdBroeck made their first contribution in https://github.com/crouchcd/pkce-challenge/pull/38

**Full Changelog**: https://github.com/crouchcd/pkce-challenge/compare/5.0.0...5.0.1

## [5.0.0](https://github.com/crouchcd/pkce-challenge/releases/tag/5.0.0) - 2025-03-30

## What's Changed

- fix: add support for commonjs module by @li-yechao in https://github.com/crouchcd/pkce-challenge/pull/32

## New Contributors

- @li-yechao made their first contribution in https://github.com/crouchcd/pkce-challenge/pull/32

**Full Changelog**: https://github.com/crouchcd/pkce-challenge/compare/4.1.0...5.0.0

## [4.1.0](https://github.com/crouchcd/pkce-challenge/releases/tag/4.1.0) - 2024-01-25

## What's Changed

- Separate entrypoints for node and browser by @mdarocha in https://github.com/crouchcd/pkce-challenge/pull/25

## New Contributors

- @mdarocha made their first contribution in https://github.com/crouchcd/pkce-challenge/pull/25

**Full Changelog**: https://github.com/crouchcd/pkce-challenge/compare/4.0.1...4.1.0

## [4.0.1](https://github.com/crouchcd/pkce-challenge/releases/tag/4.0.1) - 2023-05-11

- chore: update README (dc76443a502c25ce98258cea3f25fd78a22cb2a8)
- chore: specify node engines >= 16.20.0 (5e7fc5edbcd0e19f99fc11a9705e5e708a100be8)

## [4.0.0](https://github.com/crouchcd/pkce-challenge/releases/tag/4.0.0) - 2023-05-11

- BREAKING CHANGE: Use Web Cryptography API (#20), closes #21, #18

### Contributors

- [saschanaz](https://github.com/saschanaz)

## [3.1.0] - 2023-03-29

- chore: Use ES6 imports for crypto-js to reduce bundle size

### Contributors

- [gretchenfitze]

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

[gretchenfitze]: https://github.com/gretchenfitze
[seyyedkhandon]: https://github.com/SeyyedKhandon
[lordnox]: https://github.com/lordnox
[3.1.0]: https://github.com/crouchcd/pkce-challenge/releases/tag/3.1.0
[3.0.0]: https://github.com/crouchcd/pkce-challenge/releases/tag/3.0.0
[2.2.0]: https://github.com/crouchcd/pkce-challenge/releases/tag/2.2.0
[2.1.0]: https://github.com/crouchcd/pkce-challenge/releases/tag/2.1.0
[2.0.0]: https://github.com/crouchcd/pkce-challenge/releases/tag/2.0.0
