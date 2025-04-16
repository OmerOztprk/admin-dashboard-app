// src/app/pages/auth/register/register.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  email = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  onSubmit() {
    this.authService.register(this.email, this.password).subscribe({
      next: (res) => {
        this.snackBar.open('Kayıt işlemi başarılı', 'Kapat', { duration: 3000 });
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.snackBar.open('Kayıt başarısız: ' + err.error?.message, 'Kapat', {
          duration: 3000
        });
      }
    });
  }
}
