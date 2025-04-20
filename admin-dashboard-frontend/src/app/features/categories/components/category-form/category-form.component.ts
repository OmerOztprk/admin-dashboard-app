import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../../../core/services/category.service';
import { Category } from '../../../../core/models/category.model';
import { ApiResponse } from '../../../../core/models/api-response.model';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  categoryId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoryId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.categoryId;

    this.initForm();

    if (this.isEditMode && this.categoryId) {
      this.categoryService.getCategoryById(this.categoryId).subscribe({
        next: (res: ApiResponse<Category>) => {
          if (res.data) {
            this.form.patchValue(res.data);
          } else {
            alert('Kategori bulunamadı.');
          }
        },
        error: (err) => {
          alert('Kategori bilgisi alınamadı: ' + err.message);
        }
      });
    }
  }

  initForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      is_active: [true]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const formData = this.form.value;

    const request$ = this.isEditMode && this.categoryId
      ? this.categoryService.updateCategory({ _id: this.categoryId, ...formData })
      : this.categoryService.createCategory(formData);

    request$.subscribe({
      next: () => this.router.navigate(['/dashboard/categories']),
      error: (err) => alert('Hata: ' + err.message)
    });
  }
}
