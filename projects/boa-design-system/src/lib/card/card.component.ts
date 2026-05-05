import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'boa-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card class="boa-card" [class.boa-card--accent]="accent">
      <div *ngIf="title" class="boa-card__header">
        <h3 class="boa-card__title">{{ title }}</h3>
        <span *ngIf="subtitle" class="boa-card__subtitle">{{ subtitle }}</span>
      </div>
      <div class="boa-card__body">
        <ng-content></ng-content>
      </div>
    </mat-card>
  `,
  styles: [`
    .boa-card {
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
      padding: 24px;
    }
    .boa-card--accent {
      border-left: 4px solid #e31837;
    }
    .boa-card__header {
      margin-bottom: 16px;
    }
    .boa-card__title {
      font-size: 18px;
      font-weight: 600;
      color: #012169;
      margin: 0;
    }
    .boa-card__subtitle {
      font-size: 13px;
      color: #6b7280;
    }
  `],
})
export class BoaCardComponent {
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() accent = false;
}
