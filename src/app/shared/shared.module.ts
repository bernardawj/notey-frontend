import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { NameInitialsPipe } from './name-initials.pipe';

@NgModule({
  declarations: [
    NameInitialsPipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    NameInitialsPipe
  ]
})
export class SharedModule {
}
