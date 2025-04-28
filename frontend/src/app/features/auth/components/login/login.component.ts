import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { Login2FAResponse } from '../../../../core/models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  codeForm!: FormGroup;

  loading = false;
  error = '';
  show2FA = false;

  private readonly returnUrl: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'] || '/dashboard';

    if (this.authService.isAuthenticated()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });

    this.codeForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmitLogin(): void {
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.error = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: res => {
        this.loading = false;

        if ((res as Login2FAResponse).step === '2fa') {
          this.show2FA = true;
          return;
        }

        this.router.navigate([this.returnUrl]);
      },
      error: err => this.handleError(err)
    });
  }

  onSubmitCode(): void {
    if (this.codeForm.invalid) return;
    this.loading = true;
    this.error = '';

    this.authService.verifyCode(this.codeForm.value.code).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate([this.returnUrl]);
      },
      error: err => this.handleError(err)
    });
  }

  private handleError(err: any): void {
    this.loading = false;
    this.error =
      err?.message || 'İşlem sırasında bir hata oluştu, lütfen tekrar deneyin.';
    console.error(err);
  }
}
