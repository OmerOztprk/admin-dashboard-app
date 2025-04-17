import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  UrlTree 
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../features/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  
  constructor(private authService: AuthService, private router: Router) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Kullanıcı giriş yapmışsa true döndür, yoksa login sayfasına yönlendir
    if (this.authService.isAuthenticated()) {
      return true;
    }
    
    console.log('Yetkilendirme başarısız: Login sayfasına yönlendiriliyor');
    
    // Giriş yapılmamış, login sayfasına yönlendir
    return this.router.createUrlTree(['/auth/login'], {
      queryParams: {
        returnUrl: state.url
      }
    });
  }
}