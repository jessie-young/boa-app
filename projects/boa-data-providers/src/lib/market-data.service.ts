import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MarketQuote } from './data.types';

const MOCK_QUOTES: MarketQuote[] = [
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF', price: 528.41, changePct: 0.42 },
  { symbol: 'QQQ', name: 'Invesco QQQ Trust', price: 461.78, changePct: -0.18 },
  { symbol: 'BAC', name: 'Bank of America Corp', price: 38.92, changePct: 1.07 },
  { symbol: 'AAPL', name: 'Apple Inc.', price: 192.34, changePct: 0.83 },
];

@Injectable({ providedIn: 'root' })
export class MarketDataService {
  watchlist(): Observable<MarketQuote[]> {
    const jittered = MOCK_QUOTES.map(q => ({
      ...q,
      price: +(q.price * (1 + (Math.random() - 0.5) * 0.002)).toFixed(2),
    }));
    return of(jittered).pipe(delay(600));
  }
}
