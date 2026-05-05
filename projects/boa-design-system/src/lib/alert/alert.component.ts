import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

export type BoaAlertSeverity = 'info' | 'success' | 'warning' | 'error';

@Component({
  selector: 'boa-alert',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="boa-alert" [class]="'boa-alert--' + severity" role="alert">
      <strong *ngIf="title" class="boa-alert__title">{{ title }}</strong>
      <span class="boa-alert__message"><ng-content></ng-content></span>
    </div>
  `,
  styles: [`
    .boa-alert {
      padding: 12px 16px;
      border-radius: 4px;
      border-left: 4px solid;
      font-size: 14px;
      margin-bottom: 16px;
    }
    .boa-alert__title {
      display: block;
      margin-bottom: 4px;
    }
    .boa-alert--info {
      background-color: #eff6ff;
      border-color: #2563eb;
      color: #1e40af;
    }
    .boa-alert--success {
      background-color: #f0fdf4;
      border-color: #16a34a;
      color: #166534;
    }
    .boa-alert--warning {
      background-color: #fffbeb;
      border-color: #ca8a04;
      color: #854d0e;
    }
    .boa-alert--error {
      background-color: #fef2f2;
      border-color: #b00020;
      color: #991b1b;
    }
  `],
})
export class BoaAlertComponent {
  @Input() severity: BoaAlertSeverity = 'info';
  @Input() title?: string;
}
