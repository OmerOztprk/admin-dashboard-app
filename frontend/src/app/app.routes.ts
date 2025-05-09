import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './core/layout/admin-layout/admin-layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
      },
      {
        path: 'dashboard/users',
        loadChildren: () =>
          import('./features/users/users.routes').then(m => m.USERS_ROUTES)
      },
      {
        path: 'dashboard/categories',
        loadChildren: () =>
          import('./features/categories/categories.routes').then(m => m.CATEGORIES_ROUTES)
      },
      {
        path: 'dashboard/roles',
        loadChildren: () =>
          import('./features/roles/roles.routes').then(m => m.ROLES_ROUTES)
      },
      {
        path: 'dashboard/customers',
        loadChildren: () =>
          import('./features/customers/customers.routes').then(m => m.CUSTOMERS_ROUTES)
      },
      {
        path: 'dashboard/auditlogs',
        loadChildren: () =>
          import('./features/auditlogs/auditlogs.routes').then(m => m.AUDITLOGS_ROUTES)
      },
      {
        path: 'dashboard/stats',
        loadChildren: () =>
          import('./features/stats/stats.routes').then(m => m.STATS_ROUTES)
      },

    ]
  },
  {
    path: 'chatbot/:slug',
    loadComponent: () =>
      import('./features/customers/components/customer-chatbot-page/customer-chatbot-page.component').then(
        m => m.CustomerChatbotPageComponent
      )
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
