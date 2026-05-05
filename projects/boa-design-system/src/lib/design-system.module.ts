import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { BoaButtonComponent } from './button/button.component';
import { BoaCardComponent } from './card/card.component';
import { BoaDataTableComponent } from './data-table/data-table.component';
import { BoaFormFieldComponent } from './form-field/form-field.component';
import { BoaModalComponent } from './modal/modal.component';
import { BoaAlertComponent } from './alert/alert.component';

const COMPONENTS = [
  BoaButtonComponent,
  BoaCardComponent,
  BoaDataTableComponent,
  BoaFormFieldComponent,
  BoaModalComponent,
  BoaAlertComponent,
];

@NgModule({
  declarations: COMPONENTS,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatIconModule,
  ],
  exports: COMPONENTS,
})
export class BoaDesignSystemModule {}
