// src/app/pages/auth/login/login.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        if (res?.token) {
          this.authService.setToken(res.token);
          this.snackBar.open('Giriş başarılı', 'Kapat', { duration: 3000 });
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.snackBar.open('Giriş başarısız: ' + err.error?.message, 'Kapat', {
          duration: 3000
        });
      }
    });
  }
}
