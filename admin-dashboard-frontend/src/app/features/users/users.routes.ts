import { Routes } from '@angular/router';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/users-list/users-list.component').then(m => m.UsersListComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./components/user-form/user-form.component').then(m => m.UserFormComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./components/user-form/user-form.component').then(m => m.UserFormComponent)
  },
  {
    path: 'detail/:id',
    loadComponent: () => import('./components/user-detail/user-detail.component').then(m => m.UserDetailComponent)
  }
];
