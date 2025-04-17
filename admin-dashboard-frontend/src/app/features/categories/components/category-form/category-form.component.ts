import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../../../core/models/category.model';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit {
  categoryForm!: FormGroup;
  parentCategories: Category[] = [];
  isEditMode = false;
  categoryId: string | null = null;
  loading = false;
  submitting = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadParentCategories();
    
    // ID parametresini kontrol et, varsa düzenleme modunda çalış
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.categoryId = id;
        this.loadCategory(id);
      }
    });
  }

  initForm(): void {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      parent_id: [''],
      is_active: [true]
    });
  }

  loadParentCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        // Düzenleme modunda, kendi kendini parent olarak seçmemesi için mevcut kategori ID'yi filtrele
        if (this.isEditMode && this.categoryId) {
          this.parentCategories = categories.filter(c => c._id !== this.categoryId);
        } else {
          this.parentCategories = categories;
        }
      },
      error: (err) => {
        console.error('Error loading parent categories', err);
      }
    });
  }

  loadCategory(id: string): void {
    this.loading = true;
    this.categoryService.getCategoryById(id).subscribe({
      next: (category) => {
        this.categoryForm.patchValue({
          name: category.name,
          description: category.description || '',
          parent_id: category.parent_id || '',
          is_active: category.is_active
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading category', err);
        this.error = 'Kategori bilgileri yüklenemedi.';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      // Tüm form kontrollerini dokunulmuş olarak işaretle
      Object.keys(this.categoryForm.controls).forEach(key => {
        const control = this.categoryForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.submitting = true;
    const categoryData = this.categoryForm.value;
    
    // Eğer parent_id boş ise undefined olarak ayarla
    if (categoryData.parent_id === '') {
      categoryData.parent_id = undefined;
    }

    if (this.isEditMode && this.categoryId) {
      // Kategori güncelleme
      categoryData._id = this.categoryId;
      this.categoryService.updateCategory(categoryData).subscribe({
        next: () => {
          this.router.navigate(['/categories']);
        },
        error: (err) => {
          console.error('Error updating category', err);
          this.error = 'Kategori güncellenirken bir hata oluştu.';
          this.submitting = false;
        }
      });
    } else {
      // Yeni kategori oluşturma
      this.categoryService.createCategory(categoryData).subscribe({
        next: () => {
          this.router.navigate(['/categories']);
        },
        error: (err) => {
          console.error('Error creating category', err);
          this.error = 'Kategori oluşturulurken bir hata oluştu.';
          this.submitting = false;
        }
      });
    }
  }
}