import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'boa-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="open" class="boa-modal__backdrop" (click)="onBackdropClick()">
      <div class="boa-modal__panel" (click)="$event.stopPropagation()">
        <div class="boa-modal__header">
          <h2 class="boa-modal__title">{{ title }}</h2>
          <button class="boa-modal__close" (click)="closed.emit()" aria-label="Close">&times;</button>
        </div>
        <div class="boa-modal__body">
          <ng-content></ng-content>
        </div>
        <div *ngIf="showFooter" class="boa-modal__footer">
          <ng-content select="[modalFooter]"></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .boa-modal__backdrop {
      position: fixed;
      inset: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .boa-modal__panel {
      background-color: #fff;
      border-radius: 8px;
      max-width: 480px;
      width: 90%;
      max-height: 90vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    }
    .boa-modal__header {
      padding: 20px 24px;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .boa-modal__title {
      font-size: 18px;
      font-weight: 600;
      color: #012169;
      margin: 0;
    }
    .boa-modal__close {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #6b7280;
      padding: 0;
      line-height: 1;
    }
    .boa-modal__body {
      padding: 24px;
      overflow-y: auto;
    }
    .boa-modal__footer {
      padding: 16px 24px;
      border-top: 1px solid #e5e7eb;
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
  `],
})
export class BoaModalComponent {
  @Input() open = false;
  @Input() title = '';
  @Input() showFooter = false;
  @Input() closeOnBackdrop = true;
  @Output() closed = new EventEmitter<void>();

  onBackdropClick(): void {
    if (this.closeOnBackdrop) {
      this.closed.emit();
    }
  }
}
