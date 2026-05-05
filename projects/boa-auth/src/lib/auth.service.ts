import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import {
  AuthSession,
  AuthUser,
  LoginCredentials,
  LoginResult,
  MfaChallenge,
  MfaResult,
} from './auth.types';

const DEMO_CREDENTIALS = { username: 'demo', password: 'demo' };
const DEMO_MFA_CODE = '123456';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private sessionSubject = new BehaviorSubject<AuthSession | null>(null);
  private pendingChallenge: MfaChallenge | null = null;
  private pendingUser: AuthUser | null = null;

  readonly session$: Observable<AuthSession | null> = this.sessionSubject.asObservable();
  readonly isAuthenticated$: Observable<boolean> = this.session$.pipe(map(s => s !== null));

  get currentSession(): AuthSession | null {
    return this.sessionSubject.value;
  }

  login(credentials: LoginCredentials): Observable<LoginResult> {
    if (
      credentials.username !== DEMO_CREDENTIALS.username ||
      credentials.password !== DEMO_CREDENTIALS.password
    ) {
      return of<LoginResult>({
        status: 'error',
        message: 'Invalid username or password.',
      }).pipe(delay(600));
    }

    this.pendingUser = {
      userId: 'usr_8f2a1e4b',
      username: credentials.username,
      displayName: 'Jessie Customer',
      customerSegment: 'preferred',
      ssoSessionId: this.randomId('sso'),
    };

    this.pendingChallenge = {
      challengeId: this.randomId('mfa'),
      method: 'sms',
      destination: '***-***-4827',
      expiresAt: Date.now() + 5 * 60 * 1000,
    };

    return of<LoginResult>({
      status: 'mfa_required',
      challenge: this.pendingChallenge,
    }).pipe(delay(800));
  }

  verifyMfa(challengeId: string, code: string): Observable<MfaResult> {
    if (!this.pendingChallenge || !this.pendingUser) {
      return throwError(() => new Error('No pending MFA challenge.'));
    }
    if (challengeId !== this.pendingChallenge.challengeId) {
      return of<MfaResult>({ status: 'error', message: 'Challenge mismatch.' }).pipe(delay(400));
    }
    if (code !== DEMO_MFA_CODE) {
      return of<MfaResult>({ status: 'error', message: 'Incorrect verification code.' }).pipe(delay(600));
    }

    const session: AuthSession = {
      user: this.pendingUser,
      accessToken: this.randomId('at'),
      refreshToken: this.randomId('rt'),
      expiresAt: Date.now() + 30 * 60 * 1000,
    };

    this.pendingChallenge = null;
    this.pendingUser = null;
    this.sessionSubject.next(session);

    return of<MfaResult>({ status: 'success', session }).pipe(delay(500));
  }

  logout(): Observable<void> {
    this.sessionSubject.next(null);
    this.pendingChallenge = null;
    this.pendingUser = null;
    return of(void 0).pipe(delay(200));
  }

  private randomId(prefix: string): string {
    return `${prefix}_${Math.random().toString(36).slice(2, 12)}`;
  }
}
