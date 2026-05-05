import { ModuleWithProviders, NgModule } from '@angular/core';
import { AnalyticsConfig } from './analytics.types';
import { ANALYTICS_CONFIG } from './analytics.tokens';

@NgModule({})
export class BoaAnalyticsModule {
  static forRoot(config: AnalyticsConfig): ModuleWithProviders<BoaAnalyticsModule> {
    return {
      ngModule: BoaAnalyticsModule,
      providers: [{ provide: ANALYTICS_CONFIG, useValue: config }],
    };
  }
}
