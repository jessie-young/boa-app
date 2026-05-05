export type AccountType = 'checking' | 'savings' | 'credit' | 'investment';

export interface Account {
  id: string;
  type: AccountType;
  nickname: string;
  mask: string;
  balance: number;
  availableBalance: number;
  currency: 'USD';
}

export interface Transaction {
  id: string;
  accountId: string;
  postedAt: number;
  description: string;
  amount: number;
  category: string;
  status: 'posted' | 'pending';
}

export interface MarketQuote {
  symbol: string;
  name: string;
  price: number;
  changePct: number;
}

export interface TransferRequest {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  memo?: string;
}

export interface TransferResult {
  confirmationId: string;
  scheduledFor: number;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
}
