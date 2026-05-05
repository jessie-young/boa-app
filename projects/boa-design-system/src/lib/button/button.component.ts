import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

export type BoaButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';

@Component({
  selector: 'boa-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      mat-flat-button
      [class]="'boa-btn boa-btn--' + variant"
      [disabled]="disabled"
      [type]="type"
      (click)="handleClick($event)">
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    .boa-btn {
      font-weight: 600;
      letter-spacing: 0.02em;
      min-width: 120px;
      border-radius: 4px;
    }
    .boa-btn--primary {
      background-color: #e31837;
      color: #fff;
    }
    .boa-btn--secondary {
      background-color: #012169;
      color: #fff;
    }
    .boa-btn--tertiary {
      background-color: transparent;
      color: #012169;
      border: 1px solid #012169;
    }
    .boa-btn--danger {
      background-color: #b00020;
      color: #fff;
    }
  `],
})
export class BoaButtonComponent {
  @Input() variant: BoaButtonVariant = 'primary';
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' = 'button';
  @Output() clicked = new EventEmitter<MouseEvent>();

  handleClick(event: MouseEvent): void {
    if (!this.disabled) {
      this.clicked.emit(event);
    }
  }
}
