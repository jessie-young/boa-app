import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

export interface BoaDataTableColumn<T = any> {
  key: keyof T & string;
  label: string;
  align?: 'left' | 'right' | 'center';
  format?: (value: any, row: T) => string;
}

@Component({
  selector: 'boa-data-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <table class="boa-table">
      <thead>
        <tr>
          <th
            *ngFor="let col of columns"
            [class.boa-table__cell--right]="col.align === 'right'"
            [class.boa-table__cell--center]="col.align === 'center'">
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let row of rows">
          <td
            *ngFor="let col of columns"
            [class.boa-table__cell--right]="col.align === 'right'"
            [class.boa-table__cell--center]="col.align === 'center'">
            {{ col.format ? col.format(row[col.key], row) : row[col.key] }}
          </td>
        </tr>
        <tr *ngIf="rows.length === 0">
          <td [attr.colspan]="columns.length" class="boa-table__empty">
            {{ emptyMessage }}
          </td>
        </tr>
      </tbody>
    </table>
  `,
  styles: [`
    .boa-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
    }
    .boa-table th {
      text-align: left;
      padding: 12px 16px;
      background-color: #f5f7fa;
      color: #012169;
      font-weight: 600;
      border-bottom: 2px solid #e5e7eb;
    }
    .boa-table td {
      padding: 12px 16px;
      border-bottom: 1px solid #e5e7eb;
      color: #1f2937;
    }
    .boa-table tbody tr:hover {
      background-color: #f9fafb;
    }
    .boa-table__cell--right {
      text-align: right;
    }
    .boa-table__cell--center {
      text-align: center;
    }
    .boa-table__empty {
      text-align: center;
      color: #6b7280;
      font-style: italic;
      padding: 32px;
    }
  `],
})
export class BoaDataTableComponent<T = any> {
  @Input() columns: BoaDataTableColumn<T>[] = [];
  @Input() rows: T[] = [];
  @Input() emptyMessage = 'No data to display';
}
