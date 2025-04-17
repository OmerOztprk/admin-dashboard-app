import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../users/services/user.service';
import { ToastService } from '../roles/services/toast.service';
import { AuthService } from '../auth/services/auth.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  loadingProfile = false;
  profileSuccess = '';
  profileError = '';
  updatingProfile = false;
  updatingPassword = false;
  
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private toastService: ToastService
  ) {}
  
  ngOnInit(): void {
    this.initProfileForm();
    this.initPasswordForm();
    this.loadUserProfile();
  }
  
  initProfileForm(): void {
    this.profileForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: [''],
      email: ['', [Validators.required, Validators.email]],
      phone_number: [''],
      bio: ['']
    });
  }
  
  initPasswordForm(): void {
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }
  
  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (newPassword !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ mismatch: true });
    }
    return newPassword === confirmPassword ? null : { mismatch: true };
  }
  
  loadUserProfile(): void {
    this.loadingProfile = true;
    const currentUser = this.authService.getCurrentUser();
    
    if (currentUser) {
      this.profileForm.patchValue({
        first_name: currentUser.first_name,
        last_name: currentUser.last_name,
        email: currentUser.email,
        phone_number: currentUser.phone_number || '',
      });
      this.loadingProfile = false;
    } else {
      this.userService.getCurrentUserProfile().subscribe({
        next: (user: User) => {
          this.profileForm.patchValue({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            phone_number: user.phone_number || '',
          });
          this.loadingProfile = false;
        },
        error: (error: any) => {
          console.error('Error loading profile:', error);
          this.profileError = 'Profil bilgileri yüklenemedi.';
          this.loadingProfile = false;
        }
      });
    }
  }
  
  updateProfile(): void {
    if (this.profileForm.invalid) return;
    
    this.updatingProfile = true;
    this.profileSuccess = '';
    this.profileError = '';
    
    const profileData = this.profileForm.value;
    
    this.authService.updateProfile(profileData).subscribe({
      next: (response: User) => {
        this.profileSuccess = 'Profil başarıyla güncellendi.';
        this.updatingProfile = false;
        this.toastService.show('Profil güncellendi', 'success');
      },
      error: (error: any) => {
        console.error('Error updating profile:', error);
        this.profileError = error.message || 'Profil güncellenirken bir hata oluştu.';
        this.updatingProfile = false;
      }
    });
  }
  
  updatePassword(): void {
    if (this.passwordForm.invalid) return;
    
    this.updatingPassword = true;
    
    const passwordData = {
      currentPassword: this.passwordForm.get('currentPassword')?.value,
      newPassword: this.passwordForm.get('newPassword')?.value
    };
    
    this.authService.changePassword(
      passwordData.currentPassword, 
      passwordData.newPassword
    ).subscribe({
      next: () => {
        this.toastService.show('Şifre başarıyla güncellendi', 'success');
        this.passwordForm.reset();
        this.updatingPassword = false;
      },
      error: (error: any) => {
        console.error('Error updating password:', error);
        this.toastService.show(error.message || 'Şifre güncellenirken bir hata oluştu', 'danger');
        this.updatingPassword = false;
      }
    });
  }
}