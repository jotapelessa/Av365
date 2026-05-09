export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      producerId?: string;
      role?: string;
    };
  }

  interface UserPublicMetadata {
    producerId?: string;
    role?: string;
  }
}
