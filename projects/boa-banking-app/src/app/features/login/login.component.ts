import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, MfaChallenge } from '../../../../../boa-auth/src/public-api';
import { AnalyticsService } from '../../../../../boa-analytics/src/public-api';

type Step = 'credentials' | 'mfa';

@Component({
  selector: 'app-login',
  template: `
    <div class="login">
      <div class="login__panel">
        <div class="login__brand">
          <span class="login__brand-mark">BoA</span>
          <span class="login__brand-text">Online Banking</span>
        </div>

        <ng-container *ngIf="step === 'credentials'">
          <h1 class="login__heading">Sign in to your account</h1>
          <p class="login__sub">Use your Online ID and Passcode</p>

          <boa-alert *ngIf="errorMessage" severity="error">{{ errorMessage }}</boa-alert>

          <form [formGroup]="credentialsForm" (ngSubmit)="submitCredentials()">
            <boa-form-field label="Online ID" [required]="true">
              <input formControlName="username" type="text" autocomplete="username" />
            </boa-form-field>
            <boa-form-field label="Passcode" [required]="true">
              <input formControlName="password" type="password" autocomplete="current-password" />
            </boa-form-field>
            <boa-button type="submit" variant="primary" [disabled]="loading || credentialsForm.invalid">
              {{ loading ? 'Signing in…' : 'Sign In' }}
            </boa-button>
          </form>

          <p class="login__hint">Demo credentials: <code>demo</code> / <code>demo</code></p>
        </ng-container>

        <ng-container *ngIf="step === 'mfa' && challenge">
          <h1 class="login__heading">Verify it's you</h1>
          <p class="login__sub">
            We sent a 6-digit code to {{ challenge.destination }}.
          </p>

          <boa-alert *ngIf="errorMessage" severity="error">{{ errorMessage }}</boa-alert>

          <form [formGroup]="mfaForm" (ngSubmit)="submitMfa()">
            <boa-form-field label="Verification code" hint="Demo code: 123456" [required]="true">
              <input formControlName="code" type="text" inputmode="numeric" maxlength="6" />
            </boa-form-field>
            <boa-button type="submit" variant="primary" [disabled]="loading || mfaForm.invalid">
              {{ loading ? 'Verifying…' : 'Verify' }}
            </boa-button>
          </form>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; background: linear-gradient(135deg, #012169 0%, #011956 100%); }
    .login { display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 32px; }
    .login__panel {
      background-color: #fff;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      width: 100%;
      max-width: 420px;
    }
    .login__brand { display: flex; align-items: center; gap: 12px; margin-bottom: 32px; }
    .login__brand-mark {
      background-color: #e31837; color: #fff; font-weight: 700;
      padding: 4px 8px; border-radius: 4px; letter-spacing: 0.05em; font-size: 14px;
    }
    .login__brand-text { color: #012169; font-weight: 600; font-size: 16px; }
    .login__heading { font-size: 24px; font-weight: 600; color: #012169; margin: 0 0 4px; }
    .login__sub { color: #6b7280; margin: 0 0 24px; font-size: 14px; }
    .login__hint { margin-top: 24px; font-size: 12px; color: #6b7280; text-align: center; }
    .login__hint code { background-color: #f3f4f6; padding: 2px 6px; border-radius: 3px; font-family: ui-monospace, monospace; }
  `],
})
export class LoginComponent {
  step: Step = 'credentials';
  loading = false;
  errorMessage: string | null = null;
  challenge: MfaChallenge | null = null;

  credentialsForm: FormGroup = this.fb.group({
    username: ['demo', [Validators.required]],
    password: ['demo', [Validators.required]],
  });

  mfaForm: FormGroup = this.fb.group({
    code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private analytics: AnalyticsService,
    private router: Router,
  ) {}

  submitCredentials(): void {
    if (this.credentialsForm.invalid) return;
    this.errorMessage = null;
    this.loading = true;
    this.analytics.track({ name: 'login_submitted', category: 'auth' });

    this.auth.login(this.credentialsForm.value).subscribe(result => {
      this.loading = false;
      if (result.status === 'mfa_required') {
        this.challenge = result.challenge;
        this.step = 'mfa';
        this.analytics.track({
          name: 'mfa_challenge_issued',
          category: 'auth',
          properties: { method: result.challenge.method },
        });
      } else if (result.status === 'error') {
        this.errorMessage = result.message;
        this.analytics.track({ name: 'login_failed', category: 'auth' });
      }
    });
  }

  submitMfa(): void {
    if (this.mfaForm.invalid || !this.challenge) return;
    this.errorMessage = null;
    this.loading = true;
    this.analytics.track({ name: 'mfa_submitted', category: 'auth' });

    this.auth.verifyMfa(this.challenge.challengeId, this.mfaForm.value.code).subscribe(result => {
      this.loading = false;
      if (result.status === 'success') {
        this.analytics.track({ name: 'login_completed', category: 'auth' });
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage = result.message;
        this.analytics.track({ name: 'mfa_failed', category: 'auth' });
      }
    });
  }
}
