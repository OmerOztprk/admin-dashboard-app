import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { SystemPermissions } from './core/models/role.model';

// Permission Guard ekleme
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(c => c.DashboardComponent),
    canActivate: [AuthGuard]
  },
  // Kullanıcı Rotaları
  {
    path: 'users',
    loadComponent: () => import('./features/users/components/user-list/user-list.component').then(c => c.UserListComponent),
    canActivate: [AuthGuard],
    data: { requiredPermission: SystemPermissions.USER_VIEW }
  },
  {
    path: 'users/add',
    loadComponent: () => import('./features/users/components/user-form/user-form.component').then(c => c.UserFormComponent),
    canActivate: [AuthGuard],
    data: { requiredPermission: SystemPermissions.USER_ADD }
  },
  {
    path: 'users/edit/:id',
    loadComponent: () => import('./features/users/components/user-form/user-form.component').then(c => c.UserFormComponent),
    canActivate: [AuthGuard],
    data: { requiredPermission: SystemPermissions.USER_EDIT }
  },
  // Rol Rotaları
  {
    path: 'roles',
    loadComponent: () => import('./features/roles/components/role-list/role-list.component').then(c => c.RoleListComponent),
    canActivate: [AuthGuard],
    data: { requiredPermission: SystemPermissions.ROLE_VIEW }
  },
  {
    path: 'roles/add',
    loadComponent: () => import('./features/roles/components/role-form/role-form.component').then(c => c.RoleFormComponent),
    canActivate: [AuthGuard],
    data: { requiredPermission: SystemPermissions.ROLE_ADD }
  },
  {
    path: 'roles/edit/:id',
    loadComponent: () => import('./features/roles/components/role-form/role-form.component').then(c => c.RoleFormComponent),
    canActivate: [AuthGuard],
    data: { requiredPermission: SystemPermissions.ROLE_EDIT }
  },
  // Kategori Rotaları
  {
    path: 'categories',
    loadComponent: () => import('./features/categories/components/category-list/category-list.component').then(c => c.CategoryListComponent),
    canActivate: [AuthGuard],
    data: { requiredPermission: SystemPermissions.CATEGORY_VIEW }
  },
  {
    path: 'categories/add',
    loadComponent: () => import('./features/categories/components/category-form/category-form.component').then(c => c.CategoryFormComponent),
    canActivate: [AuthGuard],
    data: { requiredPermission: SystemPermissions.CATEGORY_ADD }
  },
  {
    path: 'categories/edit/:id',
    loadComponent: () => import('./features/categories/components/category-form/category-form.component').then(c => c.CategoryFormComponent),
    canActivate: [AuthGuard],
    data: { requiredPermission: SystemPermissions.CATEGORY_EDIT }
  },
  // Profil ve Ayarlar
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile.component').then(c => c.ProfileComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'settings',
    loadComponent: () => import('./features/settings/settings.component').then(c => c.SettingsComponent),
    canActivate: [AuthGuard]
  },
  // 404 Sayfası
  {
    path: '**',
    loadComponent: () => import('./core/components/not-found/not-found.component').then(c => c.NotFoundComponent)
  }
];