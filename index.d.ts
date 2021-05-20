// Type definitions for pkce-challenge 2.2.0
// Project: https://github.com/crouchcd/pkce-challenge
// Definitions by:
// Tobias Kopelke <https://github.com/lordnox>,
// Cameron Crouch <https://github.com/crouchcd>

declare module 'pkce-challenge' {
  export default function pkceChallenge(length?: number): {
    code_challenge: string;
    code_verifier: string;
  };
  export function verifyChallenge(
    code_verifier: string,
    expectedChallenge: string
  ): boolean;

  export function generateChallenge(code_verifier: string): string;
}
