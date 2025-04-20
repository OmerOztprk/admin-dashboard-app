import { Routes } from '@angular/router';

export const ROLES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/roles-list/roles-list.component').then(
        m => m.RolesListComponent
      )
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./components/role-form/role-form.component').then(
        m => m.RoleFormComponent
      )
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./components/role-form/role-form.component').then(
        m => m.RoleFormComponent
      )
  }
];
