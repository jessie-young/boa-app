import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Account } from './data.types';

const MOCK_ACCOUNTS: Account[] = [
  {
    id: 'acct_chk_001',
    type: 'checking',
    nickname: 'Advantage Plus Checking',
    mask: '4827',
    balance: 8432.19,
    availableBalance: 8432.19,
    currency: 'USD',
  },
  {
    id: 'acct_sav_002',
    type: 'savings',
    nickname: 'Advantage Savings',
    mask: '9013',
    balance: 24105.78,
    availableBalance: 24105.78,
    currency: 'USD',
  },
  {
    id: 'acct_cc_003',
    type: 'credit',
    nickname: 'Customized Cash Rewards',
    mask: '5521',
    balance: -1247.36,
    availableBalance: 8752.64,
    currency: 'USD',
  },
  {
    id: 'acct_inv_004',
    type: 'investment',
    nickname: 'Merrill Edge — Self-Directed',
    mask: '7740',
    balance: 67_392.41,
    availableBalance: 67_392.41,
    currency: 'USD',
  },
];

@Injectable({ providedIn: 'root' })
export class AccountService {
  list(): Observable<Account[]> {
    return of(MOCK_ACCOUNTS).pipe(delay(400));
  }

  getById(id: string): Observable<Account | undefined> {
    return of(MOCK_ACCOUNTS.find(a => a.id === id)).pipe(delay(200));
  }
}
