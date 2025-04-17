import { Injectable } from '@angular/core';
import { 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  UrlTree,
  Router 
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../features/auth/services/auth.service';
import { SystemPermissions } from '../models/role.model';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard {
  
  constructor(private authService: AuthService, private router: Router) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Route'un data property'sinden gerekli izni al
    const requiredPermission = route.data['requiredPermission'] as SystemPermissions;
    
    if (!requiredPermission) {
      console.error('Permission guard için route data içinde requiredPermission tanımlanmamış!');
      return true; // İzin tanımlanmamışsa geçişe izin ver
    }
    
    // Kullanıcının gerekli izne sahip olup olmadığını kontrol et
    if (this.authService.hasPermission(requiredPermission)) {
      return true;
    }
    
    console.log(`İzin reddedildi: ${requiredPermission} iznine sahip değilsiniz.`);
    
    // İzin yoksa dashboard'a yönlendir
    return this.router.createUrlTree(['/dashboard']);
  }
}