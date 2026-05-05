import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { BoaDesignSystemModule } from '../../../boa-design-system/src/public-api';
import { BoaAnalyticsModule } from '../../../boa-analytics/src/public-api';

import { environment } from '../environments/environment';
import { APP_ROUTES } from './app.routes';
import { AppComponent } from './app.component';
import { AppShellComponent } from './shell/app-shell.component';
import { LoginComponent } from './features/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { TransferComponent } from './features/transfer/transfer.component';

@NgModule({
  declarations: [
    AppComponent,
    AppShellComponent,
    LoginComponent,
    DashboardComponent,
    TransferComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(APP_ROUTES),
    BoaDesignSystemModule,
    BoaAnalyticsModule.forRoot({
      appId: environment.appId,
      environment: environment.analyticsEnv,
      enableConsoleLogging: !environment.production,
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
