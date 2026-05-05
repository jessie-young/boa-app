import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'boa-form-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="boa-form-field" [class.boa-form-field--error]="hasError">
      <label *ngIf="label" class="boa-form-field__label">
        {{ label }}
        <span *ngIf="required" class="boa-form-field__required">*</span>
      </label>
      <div class="boa-form-field__control">
        <ng-content></ng-content>
      </div>
      <div *ngIf="hint && !hasError" class="boa-form-field__hint">{{ hint }}</div>
      <div *ngIf="hasError && errorMessage" class="boa-form-field__error">{{ errorMessage }}</div>
    </div>
  `,
  styles: [`
    .boa-form-field {
      display: flex;
      flex-direction: column;
      margin-bottom: 16px;
    }
    .boa-form-field__label {
      font-size: 13px;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 6px;
    }
    .boa-form-field__required {
      color: #e31837;
      margin-left: 2px;
    }
    .boa-form-field__control ::ng-deep input,
    .boa-form-field__control ::ng-deep select {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      font-size: 14px;
      background-color: #fff;
    }
    .boa-form-field__control ::ng-deep input:focus,
    .boa-form-field__control ::ng-deep select:focus {
      outline: none;
      border-color: #012169;
      box-shadow: 0 0 0 3px rgba(1, 33, 105, 0.1);
    }
    .boa-form-field--error .boa-form-field__control ::ng-deep input,
    .boa-form-field--error .boa-form-field__control ::ng-deep select {
      border-color: #b00020;
    }
    .boa-form-field__hint {
      font-size: 12px;
      color: #6b7280;
      margin-top: 4px;
    }
    .boa-form-field__error {
      font-size: 12px;
      color: #b00020;
      margin-top: 4px;
    }
  `],
})
export class BoaFormFieldComponent {
  @Input() label?: string;
  @Input() hint?: string;
  @Input() errorMessage?: string;
  @Input() hasError = false;
  @Input() required = false;
}
