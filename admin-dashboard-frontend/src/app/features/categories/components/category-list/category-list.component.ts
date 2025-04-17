import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../../../core/models/category.model';
import { AuthService } from '../../../auth/services/auth.service';
import { SystemPermissions } from '../../../../core/models/role.model';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  loading = false;
  error: string | null = null;
  SystemPermissions = SystemPermissions;

  constructor(
    private categoryService: CategoryService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.error = null;

    this.categoryService.getAllCategories()
      .subscribe({
        next: (categories) => {
          this.categories = categories;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Kategoriler yüklenirken bir hata oluştu.';
          this.loading = false;
          console.error('Error loading categories', err);
        }
      });
  }

  hasPermission(permission: SystemPermissions): boolean {
    return this.authService.hasPermission(permission);
  }

  deleteCategory(category: Category): void {
    if (confirm(`${category.name} kategorisini silmek istediğinizden emin misiniz?`)) {
      this.categoryService.deleteCategory(category._id)
        .subscribe({
          next: () => {
            this.categories = this.categories.filter(c => c._id !== category._id);
          },
          error: (err) => {
            console.error('Error deleting category', err);
            alert('Kategori silinirken bir hata oluştu.');
          }
        });
    }
  }
}