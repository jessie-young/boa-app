export interface AnalyticsEvent {
  name: string;
  category: 'navigation' | 'auth' | 'transaction' | 'error' | 'engagement';
  properties?: Record<string, string | number | boolean>;
  timestamp?: number;
}

export interface AnalyticsConfig {
  appId: string;
  environment: 'dev' | 'staging' | 'prod';
  enableConsoleLogging?: boolean;
}
