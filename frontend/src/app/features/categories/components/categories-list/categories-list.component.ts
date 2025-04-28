import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CategoryService } from '../../../../core/services/category.service';
import { Category } from '../../../../core/models/category.model';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss']
})
export class CategoriesListComponent implements OnInit {
  categories: Category[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.categoryService.getAllCategories().subscribe({
      next: categories => {
        this.categories = categories;
        this.isLoading = false;
      },
      error: err => {
        this.errorMessage = err.message || 'Kategoriler yüklenemedi';
        this.isLoading = false;
      }
    });
  }

  createCategory(): void {
    this.router.navigate(['/dashboard/categories/create']);
  }

  editCategory(category: Category): void {
    this.router.navigate(['/dashboard/categories/edit', category._id]);
  }

  deleteCategory(category: Category): void {
    const confirmed = confirm(`"${category.name}" kategorisini silmek istiyor musunuz?`);
    if (!confirmed) return;

    this.categoryService.deleteCategory(category._id!).subscribe({
      next: () => {
        this.categories = this.categories.filter(c => c._id !== category._id);
      },
      error: err => {
        alert('Silme işlemi başarısız: ' + err.message);
      }
    });
  }
}
