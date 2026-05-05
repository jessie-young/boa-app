import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService, AuthSession } from '../../../../boa-auth/src/public-api';
import { AnalyticsService } from '../../../../boa-analytics/src/public-api';

@Component({
  selector: 'app-shell',
  template: `
    <header class="shell__topbar">
      <div class="shell__brand">
        <span class="shell__brand-mark">BoA</span>
        <span class="shell__brand-text">Online Banking</span>
      </div>
      <nav class="shell__nav">
        <a routerLink="/dashboard" routerLinkActive="shell__nav-link--active" class="shell__nav-link">Accounts</a>
        <a routerLink="/transfer" routerLinkActive="shell__nav-link--active" class="shell__nav-link">Transfer</a>
      </nav>
      <div class="shell__user" *ngIf="(session$ | async) as s">
        <span class="shell__user-name">{{ s.user.displayName }}</span>
        <span class="shell__user-segment">{{ s.user.customerSegment | titlecase }}</span>
        <button class="shell__logout" (click)="logout()">Sign Out</button>
      </div>
    </header>
    <main class="shell__main">
      <router-outlet></router-outlet>
    </main>
    <footer class="shell__footer">
      <span>© Bank of America Corporation. Demo build — not a real banking application.</span>
    </footer>
  `,
  styles: [`
    :host { display: flex; flex-direction: column; min-height: 100vh; }
    .shell__topbar {
      display: flex;
      align-items: center;
      gap: 32px;
      background: linear-gradient(90deg, #012169 0%, #011956 100%);
      color: #fff;
      padding: 0 32px;
      height: 64px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .shell__brand { display: flex; align-items: center; gap: 12px; }
    .shell__brand-mark {
      background-color: #e31837;
      color: #fff;
      font-weight: 700;
      padding: 4px 8px;
      border-radius: 4px;
      letter-spacing: 0.05em;
      font-size: 14px;
    }
    .shell__brand-text { font-size: 16px; font-weight: 600; letter-spacing: 0.02em; }
    .shell__nav { display: flex; gap: 24px; flex: 1; }
    .shell__nav-link {
      color: rgba(255, 255, 255, 0.85);
      font-size: 14px;
      font-weight: 500;
      padding: 8px 4px;
      border-bottom: 2px solid transparent;
      transition: color 0.15s, border-color 0.15s;
    }
    .shell__nav-link:hover { color: #fff; text-decoration: none; }
    .shell__nav-link--active { color: #fff; border-color: #e31837; }
    .shell__user { display: flex; align-items: center; gap: 12px; font-size: 13px; }
    .shell__user-name { font-weight: 600; }
    .shell__user-segment {
      background-color: rgba(255, 255, 255, 0.15);
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 11px;
      letter-spacing: 0.05em;
    }
    .shell__logout {
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.4);
      color: #fff;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
    }
    .shell__logout:hover { background-color: rgba(255, 255, 255, 0.1); }
    .shell__main { flex: 1; padding: 32px; max-width: 1200px; margin: 0 auto; width: 100%; }
    .shell__footer {
      padding: 16px 32px;
      font-size: 12px;
      color: #6b7280;
      text-align: center;
      border-top: 1px solid #e5e7eb;
      background-color: #fff;
    }
  `],
})
export class AppShellComponent implements OnInit {
  session$: Observable<AuthSession | null>;

  constructor(
    private auth: AuthService,
    private router: Router,
    private analytics: AnalyticsService,
  ) {
    this.session$ = this.auth.session$;
  }

  ngOnInit(): void {
    this.analytics.track({
      name: 'shell_loaded',
      category: 'navigation',
    });
  }

  logout(): void {
    this.analytics.track({ name: 'logout_clicked', category: 'auth' });
    this.auth.logout().subscribe(() => this.router.navigate(['/login']));
  }
}
