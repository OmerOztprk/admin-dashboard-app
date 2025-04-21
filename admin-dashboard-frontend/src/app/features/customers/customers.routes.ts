import { Routes } from '@angular/router';

export const CUSTOMERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/customers-list/customers-list.component').then(m => m.CustomersListComponent)
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./components/customer-form/customer-form.component').then(m => m.CustomerFormComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./components/customer-form/customer-form.component').then(m => m.CustomerFormComponent)
  }
];
