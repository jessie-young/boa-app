import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import {
  Account,
  AccountService,
  MarketDataService,
  MarketQuote,
  Transaction,
  TransactionService,
} from '../../../../../boa-data-providers/src/public-api';
import { AnalyticsService } from '../../../../../boa-analytics/src/public-api';
import { BoaDataTableColumn } from '../../../../../boa-design-system/src/public-api';

interface DashboardVm {
  accounts: Account[];
  primaryTransactions: Transaction[];
  watchlist: MarketQuote[];
  totals: { assets: number; liabilities: number; net: number };
}

@Component({
  selector: 'app-dashboard',
  template: `
    <ng-container *ngIf="vm$ | async as vm; else loading">
      <section class="dash__summary">
        <div>
          <h1 class="dash__heading">Good afternoon</h1>
          <p class="dash__sub">Here's where things stand today.</p>
        </div>
        <div class="dash__net">
          <span class="dash__net-label">Net Position</span>
          <span class="dash__net-value">{{ vm.totals.net | currency }}</span>
          <span class="dash__net-detail">
            Assets {{ vm.totals.assets | currency }} · Liabilities {{ -vm.totals.liabilities | currency }}
          </span>
        </div>
      </section>

      <section class="dash__accounts">
        <boa-card
          *ngFor="let acct of vm.accounts"
          [title]="acct.nickname"
          [subtitle]="accountSubtitle(acct)"
          [accent]="acct.type === 'checking'">
          <div class="dash__balance">
            <span class="dash__balance-label">Current Balance</span>
            <span class="dash__balance-value" [class.dash__balance-value--neg]="acct.balance < 0">
              {{ acct.balance | currency }}
            </span>
          </div>
          <div class="dash__balance-row" *ngIf="acct.type === 'credit'">
            <span>Available Credit</span>
            <span>{{ acct.availableBalance | currency }}</span>
          </div>
        </boa-card>
      </section>

      <section class="dash__split">
        <boa-card title="Recent Activity" subtitle="Advantage Plus Checking · ···4827" class="dash__activity">
          <boa-data-table
            [columns]="transactionColumns"
            [rows]="vm.primaryTransactions"
            emptyMessage="No recent transactions">
          </boa-data-table>
        </boa-card>

        <boa-card title="Market Snapshot" subtitle="Powered by Merrill third-party feed" class="dash__market">
          <div class="dash__quote" *ngFor="let q of vm.watchlist">
            <div>
              <span class="dash__quote-symbol">{{ q.symbol }}</span>
              <span class="dash__quote-name">{{ q.name }}</span>
            </div>
            <div class="dash__quote-right">
              <span class="dash__quote-price">{{ q.price | currency }}</span>
              <span class="dash__quote-change" [class.up]="q.changePct >= 0" [class.down]="q.changePct < 0">
                {{ q.changePct >= 0 ? '+' : '' }}{{ q.changePct | number:'1.2-2' }}%
              </span>
            </div>
          </div>
        </boa-card>
      </section>
    </ng-container>
    <ng-template #loading>
      <p class="dash__loading">Loading your accounts…</p>
    </ng-template>
  `,
  styles: [`
    .dash__summary { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px; gap: 24px; }
    .dash__heading { font-size: 28px; color: #012169; margin: 0; font-weight: 600; }
    .dash__sub { color: #6b7280; margin: 4px 0 0; font-size: 14px; }
    .dash__net { display: flex; flex-direction: column; align-items: flex-end; }
    .dash__net-label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; }
    .dash__net-value { font-size: 28px; color: #012169; font-weight: 700; }
    .dash__net-detail { font-size: 12px; color: #6b7280; }

    .dash__accounts { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .dash__balance { display: flex; flex-direction: column; }
    .dash__balance-label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; }
    .dash__balance-value { font-size: 24px; font-weight: 700; color: #012169; }
    .dash__balance-value--neg { color: #b00020; }
    .dash__balance-row { display: flex; justify-content: space-between; margin-top: 8px; font-size: 13px; color: #6b7280; }

    .dash__split { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; }
    @media (max-width: 900px) { .dash__split { grid-template-columns: 1fr; } }

    .dash__quote {
      display: flex; justify-content: space-between; align-items: center;
      padding: 12px 0; border-bottom: 1px solid #e5e7eb;
    }
    .dash__quote:last-child { border-bottom: none; }
    .dash__quote-symbol { font-weight: 700; color: #012169; margin-right: 8px; }
    .dash__quote-name { font-size: 12px; color: #6b7280; }
    .dash__quote-right { display: flex; flex-direction: column; align-items: flex-end; }
    .dash__quote-price { font-weight: 600; }
    .dash__quote-change { font-size: 12px; }
    .dash__quote-change.up { color: #16a34a; }
    .dash__quote-change.down { color: #b00020; }

    .dash__loading { text-align: center; padding: 48px; color: #6b7280; }
  `],
})
export class DashboardComponent implements OnInit {
  transactionColumns: BoaDataTableColumn<Transaction>[] = [
    { key: 'postedAt', label: 'Date', format: (v) => new Date(v).toLocaleDateString() },
    { key: 'description', label: 'Description' },
    { key: 'category', label: 'Category' },
    { key: 'amount', label: 'Amount', align: 'right', format: (v) => this.formatAmount(v) },
    { key: 'status', label: 'Status', align: 'center', format: (v) => v === 'pending' ? 'Pending' : 'Posted' },
  ];

  vm$!: Observable<DashboardVm>;

  constructor(
    private accounts: AccountService,
    private transactions: TransactionService,
    private market: MarketDataService,
    private analytics: AnalyticsService,
  ) {}

  ngOnInit(): void {
    this.analytics.trackPageView('/dashboard');
    this.vm$ = this.accounts.list().pipe(
      switchMap(accts => combineLatest([
        this.transactions.recentForAccount('acct_chk_001'),
        this.market.watchlist(),
      ]).pipe(
        map(([tx, watchlist]) => ({
          accounts: accts,
          primaryTransactions: tx,
          watchlist,
          totals: this.totals(accts),
        })),
      )),
    );
  }

  accountSubtitle(a: Account): string {
    return `${this.accountTypeLabel(a.type)} · ···${a.mask}`;
  }

  private accountTypeLabel(t: Account['type']): string {
    switch (t) {
      case 'checking': return 'Checking';
      case 'savings': return 'Savings';
      case 'credit': return 'Credit Card';
      case 'investment': return 'Investment';
    }
  }

  private formatAmount(amount: number): string {
    const sign = amount < 0 ? '-' : '';
    return `${sign}$${Math.abs(amount).toFixed(2)}`;
  }

  private totals(accts: Account[]): DashboardVm['totals'] {
    const assets = accts.filter(a => a.balance > 0).reduce((s, a) => s + a.balance, 0);
    const liabilities = accts.filter(a => a.balance < 0).reduce((s, a) => s + a.balance, 0);
    return { assets, liabilities, net: assets + liabilities };
  }
}
