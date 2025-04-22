import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const permissionGuard = (permission: string): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const hasAccess = authService.hasPermission(permission);

    if (!hasAccess) {
      router.navigate(['/dashboard']);
    }

    return hasAccess;
  };
};
