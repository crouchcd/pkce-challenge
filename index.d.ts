// Type definitions for randomatic 3.1
// Project: https://github.com/crouchcd/pkce-challenge
// Definitions by: Tobias Kopelke <https://github.com/lordnox>

declare module 'pkce-challenge' {
  export declare function generateVerifier(length: number): string;
  export declare function generateChallenge(code_verifier: string): string;
  export default function generatePKCE(length?: number): {
      code_verifier: string;
      code_challenge: string;
  };
}
