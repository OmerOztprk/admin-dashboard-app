import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  error = '';
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';

    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  ngOnInit(): void { }

  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    console.log('Login formu gönderiliyor:', this.loginForm.value);

    this.authService.login(this.loginForm.value)
      .subscribe({
        next: (user) => {
          console.log('Login başarılı, kullanıcı:', user);
          this.router.navigate([this.returnUrl]);
        },
        error: (error) => {
          console.log('Login hatası:', error);
          if (typeof error === 'string') {
            this.error = error;
          } else if (error.message) {
            this.error = error.message;
          } else {
            this.error = 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.';
          }
          this.loading = false;
        }
      });
  }
}