import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { UserService } from '../../../../core/services/user.service';
import { RoleService } from '../../../../core/services/role.service';
import { User } from '../../../../core/models/user.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  userId!: string;
  roles: { _id: string; role_name: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private roleService: RoleService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.isEditMode = !!params['id'];
      this.userId = params['id'];
      this.loadRoles(() => {
        this.initForm();
        if (this.isEditMode) this.loadUser(this.userId);
      });
    });
  }

  initForm(): void {
    this.form = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: [''],
      is_active: [true],
      roles: [[], Validators.required],
      password: ['']
    });

    // Eğer yeni kullanıcı oluşturuluyorsa, şifre zorunlu ve minimum 6 karakter olmalı
    if (!this.isEditMode) {
      this.form.get('password')?.addValidators([Validators.required, Validators.minLength(6)]);
    }
  }

  loadRoles(callback?: () => void): void {
    this.roleService.getRoles().subscribe({
      next: roles => {
        this.roles = roles;
        callback?.();
      },
      error: err => console.error('Roller alınamadı:', err.message)
    });
  }

  loadUser(id: string): void {
    this.userService.getUserById(id).subscribe({
      next: res => {
        if (res.data) {
          const user = res.data;

          const roleIds = this.roles
            .filter(role => user.roles?.includes(role.role_name))
            .map(role => role._id);

          this.form.patchValue({
            ...user,
            roles: roleIds,
            password: ''
          });

          // 🛠 Formun dirty/valid kontrolü yeniden tetiklenmesi için
          setTimeout(() => {
            this.form.markAsTouched();
            this.form.markAsDirty();
            this.form.updateValueAndValidity();
          });
        }
      },
      error: err => console.error('Kullanıcı yüklenemedi:', err.message)
    });
  }


  onSubmit(): void {
    if (this.form.invalid) return;

    const formData = { ...this.form.value };

    const action$ = this.isEditMode
      ? this.userService.updateUser(this.userId, formData)
      : this.userService.createUser(formData);

    action$.subscribe({
      next: () => this.router.navigate(['/dashboard/users']),
      error: err => alert('Hata: ' + (err?.message || 'İşlem sırasında hata oluştu'))
    });
  }

  toggleRole(roleId: string): void {
    const currentRoles = this.form.get('roles')?.value || [];
    const updated = currentRoles.includes(roleId)
      ? currentRoles.filter((id: string) => id !== roleId)
      : [...currentRoles, roleId];

    this.form.patchValue({ roles: updated });
    this.form.get('roles')?.markAsDirty();
    this.form.get('roles')?.markAsTouched();
  }
}
