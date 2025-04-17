import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  generalSettingsForm!: FormGroup;
  securitySettingsForm!: FormGroup;
  notificationSettingsForm!: FormGroup;
  
  savingGeneralSettings = false;
  savingSecuritySettings = false;
  savingNotificationSettings = false;

  private apiUrl = 'http://localhost:5000/api';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.initGeneralSettingsForm();
    this.initSecuritySettingsForm();
    this.initNotificationSettingsForm();
    this.loadSettings();
  }

  initGeneralSettingsForm(): void {
    this.generalSettingsForm = this.fb.group({
      companyName: ['', Validators.required],
      contactEmail: ['', [Validators.required, Validators.email]],
      language: ['tr']
    });
  }

  initSecuritySettingsForm(): void {
    this.securitySettingsForm = this.fb.group({
      requireStrongPasswords: [true],
      maxLoginAttempts: [5, [Validators.required, Validators.min(3), Validators.max(10)]],
      sessionTimeout: [30, [Validators.required, Validators.min(5), Validators.max(120)]]
    });
  }

  initNotificationSettingsForm(): void {
    this.notificationSettingsForm = this.fb.group({
      emailNotifications: [true],
      loginAlerts: [true],
      securityAlerts: [true],
      systemUpdates: [false]
    });
  }

  loadSettings(): void {
    // Genel ayarlar
    this.http.get(`${this.apiUrl}/settings/general`).pipe(
      catchError(() => of({ companyName: 'Admin Dashboard', contactEmail: 'admin@example.com', language: 'tr' }))
    ).subscribe(settings => {
      this.generalSettingsForm.patchValue(settings);
    });

    // Güvenlik ayarları
    this.http.get(`${this.apiUrl}/settings/security`).pipe(
      catchError(() => of({ requireStrongPasswords: true, maxLoginAttempts: 5, sessionTimeout: 30 }))
    ).subscribe(settings => {
      this.securitySettingsForm.patchValue(settings);
    });

    // Bildirim ayarları
    this.http.get(`${this.apiUrl}/settings/notifications`).pipe(
      catchError(() => of({ emailNotifications: true, loginAlerts: true, securityAlerts: true, systemUpdates: false }))
    ).subscribe(settings => {
      this.notificationSettingsForm.patchValue(settings);
    });
  }

  saveGeneralSettings(): void {
    if (this.generalSettingsForm.invalid) return;
    
    this.savingGeneralSettings = true;
    this.http.post(`${this.apiUrl}/settings/general`, this.generalSettingsForm.value).pipe(
      tap(() => {
        this.savingGeneralSettings = false;
      }),
      catchError(err => {
        console.error('Genel ayarlar kaydedilirken hata oluştu:', err);
        this.savingGeneralSettings = false;
        return of(null);
      })
    ).subscribe();
  }

  saveSecuritySettings(): void {
    if (this.securitySettingsForm.invalid) return;
    
    this.savingSecuritySettings = true;
    this.http.post(`${this.apiUrl}/settings/security`, this.securitySettingsForm.value).pipe(
      tap(() => {
        this.savingSecuritySettings = false;
      }),
      catchError(err => {
        console.error('Güvenlik ayarları kaydedilirken hata oluştu:', err);
        this.savingSecuritySettings = false;
        return of(null);
      })
    ).subscribe();
  }

  saveNotificationSettings(): void {
    if (this.notificationSettingsForm.invalid) return;
    
    this.savingNotificationSettings = true;
    this.http.post(`${this.apiUrl}/settings/notifications`, this.notificationSettingsForm.value).pipe(
      tap(() => {
        this.savingNotificationSettings = false;
      }),
      catchError(err => {
        console.error('Bildirim ayarları kaydedilirken hata oluştu:', err);
        this.savingNotificationSettings = false;
        return of(null);
      })
    ).subscribe();
  }
}