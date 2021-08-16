import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { NameInitialsPipe } from './name-initials.pipe';

@NgModule({
  declarations: [
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
    NameInitialsPipe
  ]
})
export class SharedModule {
}
