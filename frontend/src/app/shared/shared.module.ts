// src/app/shared/shared.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HasRoleDirective } from './directives/has-role.directive';
import { MaterialModule } from './material.module';

@NgModule({
  declarations: [
    HasRoleDirective
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    MaterialModule,
    HasRoleDirective
  ]
})
export class SharedModule {}
