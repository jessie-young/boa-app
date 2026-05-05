export interface AuthUser {
  userId: string;
  username: string;
  displayName: string;
  customerSegment: 'retail' | 'preferred' | 'private';
  ssoSessionId: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface MfaChallenge {
  challengeId: string;
  method: 'sms' | 'app' | 'email';
  destination: string;
  expiresAt: number;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export type LoginResult =
  | { status: 'mfa_required'; challenge: MfaChallenge }
  | { status: 'success'; session: AuthSession }
  | { status: 'error'; message: string };

export type MfaResult =
  | { status: 'success'; session: AuthSession }
  | { status: 'error'; message: string };
