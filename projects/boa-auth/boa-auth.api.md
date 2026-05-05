# @boa/auth — Public API Surface

> Baseline spec generated from `projects/boa-auth/src/public-api.ts`.
> Any change to this file indicates a public API modification that must be reviewed for backward-compatibility.

---

## Module

### `BoaAuthModule`

```ts
import { NgModule } from '@angular/core';

@NgModule({})
export class BoaAuthModule {}
```

**Entry point:** `@boa/auth`
**Providers:** None (services use `providedIn: 'root'`).

---

## Services

### `AuthService`

```ts
@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly session$: Observable<AuthSession | null>;
  readonly isAuthenticated$: Observable<boolean>;

  get currentSession(): AuthSession | null;

  login(credentials: LoginCredentials): Observable<LoginResult>;
  verifyMfa(challengeId: string, code: string): Observable<MfaResult>;
  logout(): Observable<void>;
}
```

| Member | Kind | Type | Description |
| --- | --- | --- | --- |
| `session$` | Observable | `Observable<AuthSession \| null>` | Emits the current session or `null` when unauthenticated. |
| `isAuthenticated$` | Observable | `Observable<boolean>` | Derived from `session$`; `true` when a session exists. |
| `currentSession` | Getter | `AuthSession \| null` | Synchronous snapshot of the latest session value. |
| `login` | Method | `(credentials: LoginCredentials) => Observable<LoginResult>` | Initiates authentication. Returns MFA challenge, success, or error. |
| `verifyMfa` | Method | `(challengeId: string, code: string) => Observable<MfaResult>` | Completes the MFA step. Emits session on success. |
| `logout` | Method | `() => Observable<void>` | Clears the active session and pending challenges. |

---

## Guards

### `AuthGuard`

```ts
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  canActivate(): Observable<boolean | UrlTree>;
}
```

| Member | Kind | Type | Description |
| --- | --- | --- | --- |
| `canActivate` | Method | `() => Observable<boolean \| UrlTree>` | Returns `true` if authenticated; otherwise redirects to `/login`. |

---

## Types

### `AuthUser`

```ts
export interface AuthUser {
  userId: string;
  username: string;
  displayName: string;
  customerSegment: 'retail' | 'preferred' | 'private';
  ssoSessionId: string;
}
```

### `LoginCredentials`

```ts
export interface LoginCredentials {
  username: string;
  password: string;
}
```

### `MfaChallenge`

```ts
export interface MfaChallenge {
  challengeId: string;
  method: 'sms' | 'app' | 'email';
  destination: string;
  expiresAt: number;
}
```

### `AuthSession`

```ts
export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}
```

### `LoginResult`

```ts
export type LoginResult =
  | { status: 'mfa_required'; challenge: MfaChallenge }
  | { status: 'success'; session: AuthSession }
  | { status: 'error'; message: string };
```

### `MfaResult`

```ts
export type MfaResult =
  | { status: 'success'; session: AuthSession }
  | { status: 'error'; message: string };
```

---

## Peer Dependencies

| Package | Version |
| --- | --- |
| `@angular/common` | `^14.2.0` |
| `@angular/core` | `^14.2.0` |
| `rxjs` | `^7.5.0` |

---

## Export Map (`public-api.ts`)

```ts
export * from './lib/auth.module';
export * from './lib/auth.service';
export * from './lib/auth.types';
export * from './lib/auth.guard';
```
