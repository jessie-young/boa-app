import { Inject, Injectable, Optional } from '@angular/core';
import { AnalyticsConfig, AnalyticsEvent } from './analytics.types';
import { ANALYTICS_CONFIG } from './analytics.tokens';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private buffer: AnalyticsEvent[] = [];
  private readonly config: AnalyticsConfig;

  constructor(@Optional() @Inject(ANALYTICS_CONFIG) config: AnalyticsConfig | null) {
    this.config = config ?? {
      appId: 'boa-banking-app',
      environment: 'dev',
      enableConsoleLogging: true,
    };
  }

  track(event: AnalyticsEvent): void {
    const enriched: AnalyticsEvent = {
      ...event,
      timestamp: event.timestamp ?? Date.now(),
      properties: {
        appId: this.config.appId,
        environment: this.config.environment,
        ...event.properties,
      },
    };
    this.buffer.push(enriched);
    if (this.config.enableConsoleLogging) {
      // eslint-disable-next-line no-console
      console.log('[analytics]', enriched.category, enriched.name, enriched.properties);
    }
  }

  trackPageView(path: string): void {
    this.track({
      name: 'page_view',
      category: 'navigation',
      properties: { path },
    });
  }

  flush(): AnalyticsEvent[] {
    const events = [...this.buffer];
    this.buffer = [];
    return events;
  }
}
