import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { FilterComponent } from './filter/filter.component';
import { NameInitialsPipe } from './name-initials.pipe';
import { ModalComponent } from './modal/modal.component';

@NgModule({
  declarations: [
    FilterComponent,
    ModalComponent,
    NameInitialsPipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatIconModule
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    FilterComponent,
    ModalComponent,
    NameInitialsPipe
  ]
})
export class SharedModule {
}
