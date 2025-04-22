// src/app/shared/shared-standalone.ts

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NamePipe } from './pipes/name.pipe';

export const SharedStandaloneImports = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  RouterModule,
  NamePipe
];
