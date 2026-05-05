import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import {
  Account,
  AccountService,
  TransactionService,
  TransferResult,
} from '../../../../../boa-data-providers/src/public-api';
import { AnalyticsService } from '../../../../../boa-analytics/src/public-api';

@Component({
  selector: 'app-transfer',
  template: `
    <h1 class="xfer__heading">Transfer Money</h1>
    <p class="xfer__sub">Move funds between your Bank of America accounts.</p>

    <boa-card>
      <ng-container *ngIf="!confirmation">
        <form [formGroup]="form" (ngSubmit)="submit()">
          <boa-form-field label="From" [required]="true">
            <select formControlName="fromAccountId">
              <option value="" disabled>Choose an account</option>
              <option *ngFor="let a of (accounts$ | async)" [value]="a.id">
                {{ a.nickname }} (···{{ a.mask }}) — {{ a.balance | currency }}
              </option>
            </select>
          </boa-form-field>

          <boa-form-field label="To" [required]="true">
            <select formControlName="toAccountId">
              <option value="" disabled>Choose an account</option>
              <option *ngFor="let a of (accounts$ | async)" [value]="a.id">
                {{ a.nickname }} (···{{ a.mask }})
              </option>
            </select>
          </boa-form-field>

          <boa-form-field
            label="Amount"
            [required]="true"
            [hasError]="amountInvalid"
            [errorMessage]="'Enter an amount greater than $0.'">
            <input formControlName="amount" type="number" step="0.01" min="0.01" placeholder="0.00" />
          </boa-form-field>

          <boa-form-field label="Memo (optional)">
            <input formControlName="memo" type="text" maxlength="80" />
          </boa-form-field>

          <boa-alert *ngIf="error" severity="error">{{ error }}</boa-alert>

          <boa-button type="submit" variant="primary" [disabled]="loading || form.invalid">
            {{ loading ? 'Submitting…' : 'Review & Submit' }}
          </boa-button>
        </form>
      </ng-container>

      <ng-container *ngIf="confirmation">
        <boa-alert severity="success" title="Transfer scheduled">
          Confirmation #{{ confirmation.confirmationId }}
        </boa-alert>
        <dl class="xfer__receipt">
          <dt>Amount</dt><dd>{{ confirmation.amount | currency }}</dd>
          <dt>From</dt><dd>{{ accountLabel(confirmation.fromAccountId) }}</dd>
          <dt>To</dt><dd>{{ accountLabel(confirmation.toAccountId) }}</dd>
          <dt>Scheduled</dt><dd>{{ confirmation.scheduledFor | date:'medium' }}</dd>
        </dl>
        <boa-button variant="tertiary" (clicked)="reset()">Make another transfer</boa-button>
      </ng-container>
    </boa-card>
  `,
  styles: [`
    .xfer__heading { color: #012169; margin: 0 0 4px; font-weight: 600; }
    .xfer__sub { color: #6b7280; margin: 0 0 24px; font-size: 14px; }
    .xfer__receipt {
      display: grid; grid-template-columns: 140px 1fr; gap: 8px 16px;
      margin: 16px 0; font-size: 14px;
    }
    .xfer__receipt dt { color: #6b7280; }
    .xfer__receipt dd { margin: 0; color: #1f2937; font-weight: 500; }
  `],
})
export class TransferComponent implements OnInit {
  accounts$!: Observable<Account[]>;
  private accountList: Account[] = [];

  form: FormGroup = this.fb.group({
    fromAccountId: ['', Validators.required],
    toAccountId: ['', Validators.required],
    amount: [null, [Validators.required, Validators.min(0.01)]],
    memo: [''],
  });

  loading = false;
  error: string | null = null;
  confirmation: TransferResult | null = null;

  constructor(
    private fb: FormBuilder,
    private accounts: AccountService,
    private transactions: TransactionService,
    private analytics: AnalyticsService,
  ) {}

  ngOnInit(): void {
    this.analytics.trackPageView('/transfer');
    this.accounts$ = this.accounts.list();
    this.accounts$.subscribe(list => (this.accountList = list));
  }

  get amountInvalid(): boolean {
    const c = this.form.get('amount');
    return !!c && c.touched && c.invalid;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.form.value.fromAccountId === this.form.value.toAccountId) {
      this.error = 'From and To accounts must be different.';
      return;
    }

    this.loading = true;
    this.error = null;
    this.analytics.track({
      name: 'transfer_submitted',
      category: 'transaction',
      properties: { amount: this.form.value.amount },
    });

    this.transactions.submitTransfer(this.form.value).subscribe({
      next: result => {
        this.loading = false;
        this.confirmation = result;
        this.analytics.track({
          name: 'transfer_confirmed',
          category: 'transaction',
          properties: { confirmationId: result.confirmationId },
        });
      },
      error: () => {
        this.loading = false;
        this.error = 'Something went wrong. Please try again.';
      },
    });
  }

  accountLabel(id: string): string {
    const a = this.accountList.find(x => x.id === id);
    return a ? `${a.nickname} (···${a.mask})` : id;
  }

  reset(): void {
    this.confirmation = null;
    this.form.reset({ fromAccountId: '', toAccountId: '', amount: null, memo: '' });
  }
}
