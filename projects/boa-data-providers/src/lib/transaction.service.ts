import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Transaction, TransferRequest, TransferResult } from './data.types';

const day = 86_400_000;
const now = Date.now();

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't_1', accountId: 'acct_chk_001', postedAt: now - 1 * day, description: 'Whole Foods Market', amount: -84.21, category: 'Groceries', status: 'posted' },
  { id: 't_2', accountId: 'acct_chk_001', postedAt: now - 2 * day, description: 'Direct Deposit — Acme Corp', amount: 4250.00, category: 'Income', status: 'posted' },
  { id: 't_3', accountId: 'acct_chk_001', postedAt: now - 3 * day, description: 'Pacific Gas & Electric', amount: -132.45, category: 'Utilities', status: 'posted' },
  { id: 't_4', accountId: 'acct_chk_001', postedAt: now - 5 * day, description: 'Lyft Ride', amount: -18.74, category: 'Transportation', status: 'posted' },
  { id: 't_5', accountId: 'acct_chk_001', postedAt: now - 6 * day, description: 'Transfer to Savings', amount: -500.00, category: 'Transfer', status: 'posted' },
  { id: 't_6', accountId: 'acct_chk_001', postedAt: now - 8 * day, description: 'Costco Wholesale', amount: -213.88, category: 'Groceries', status: 'posted' },
  { id: 't_7', accountId: 'acct_chk_001', postedAt: now - 12 * day, description: 'Netflix', amount: -15.99, category: 'Subscriptions', status: 'posted' },
  { id: 't_8', accountId: 'acct_chk_001', postedAt: now - 0.5 * day, description: 'Pending — Amazon.com', amount: -47.32, category: 'Shopping', status: 'pending' },
];

@Injectable({ providedIn: 'root' })
export class TransactionService {
  recentForAccount(accountId: string, limit = 8): Observable<Transaction[]> {
    const filtered = MOCK_TRANSACTIONS
      .filter(t => t.accountId === accountId)
      .sort((a, b) => b.postedAt - a.postedAt)
      .slice(0, limit);
    return of(filtered).pipe(delay(450));
  }

  submitTransfer(req: TransferRequest): Observable<TransferResult> {
    const result: TransferResult = {
      confirmationId: `cnf_${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
      scheduledFor: Date.now(),
      fromAccountId: req.fromAccountId,
      toAccountId: req.toAccountId,
      amount: req.amount,
    };
    return of(result).pipe(delay(900));
  }
}
