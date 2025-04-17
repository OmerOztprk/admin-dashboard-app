import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { RoleService } from '../../../roles/services/role.service';
import { Role } from '../../../../core/models/role.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  roles: Role[] = [];
  loading = false;
  submitting = false;
  error: string | null = null;
  isEditMode = false;
  userId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private roleService: RoleService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', this.passwordValidators()],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      phone_number: [''],
      roles: [[], Validators.required],
      is_active: [true]
    });
  }

  ngOnInit(): void {
    this.loadRoles();
    
    // Check if we're in edit mode by looking for an ID parameter
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.userId = id;
      this.loadUserData(id);
    }
  }

  // Password validators change based on whether we're in edit mode
  passwordValidators() {
    return this.isEditMode ? [] : [Validators.required, Validators.minLength(6)];
  }

  loadRoles(): void {
    this.loading = true;
    this.roleService.getRoles().subscribe({
      next: (response: any) => {
        this.roles = response.data || [];
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Roller yüklenirken bir hata oluştu';
        this.loading = false;
        console.error('Error loading roles:', error);
      }
    });
  }

  loadUserData(id: string): void {
    this.loading = true;
    this.userService.getUserById(id).subscribe({
      next: (user) => {
        // Remove password field from form in edit mode
        if (this.isEditMode) {
          this.userForm.get('password')?.clearValidators();
          this.userForm.get('password')?.updateValueAndValidity();
        }
        
        this.userForm.patchValue({
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          phone_number: user.phone_number,
          roles: Array.isArray(user.roles) ? 
            typeof user.roles[0] === 'string' ? 
              user.roles : 
              user.roles.map((r: any) => r.id || r._id) : 
            [],
          is_active: user.is_active
        });
        
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Kullanıcı bilgileri yüklenirken bir hata oluştu';
        this.loading = false;
        console.error('Error loading user:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      return;
    }

    this.submitting = true;
    
    if (this.isEditMode && this.userId) {
      // Remove password if it's empty in edit mode
      const userData = {...this.userForm.value};
      if (!userData.password) {
        delete userData.password;
      }
      
      // Update existing user
      const updatedUser = {
        id: this.userId,
        ...userData
      };
      
      this.userService.updateUser(updatedUser).subscribe({
        next: () => {
          this.router.navigate(['/users']);
        },
        error: (error) => {
          this.error = error.message || 'Kullanıcı güncellenirken bir hata oluştu';
          this.submitting = false;
        }
      });
    } else {
      // Create new user
      this.userService.createUser(this.userForm.value).subscribe({
        next: () => {
          this.router.navigate(['/users']);
        },
        error: (error) => {
          this.error = error.message || 'Kullanıcı oluşturulurken bir hata oluştu';
          this.submitting = false;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/users']);
  }
}