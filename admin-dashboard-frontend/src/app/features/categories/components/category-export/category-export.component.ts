import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-category-export',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './category-export.component.html',
  styleUrls: ['./category-export.component.scss']
})
export class CategoryExportComponent implements OnInit {
  exportForm: FormGroup;
  isExporting = false;
  exportError = '';
  
  private readonly API_URL = 'http://localhost:5000/api';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.exportForm = this.fb.group({
      format: ['xlsx'], // xlsx veya csv
      includeHeaders: [true],
      parentCategoriesOnly: [false]
    });
  }

  ngOnInit(): void {}

  exportCategories() {
    this.isExporting = true;
    this.exportError = '';
    
    const options = this.exportForm.value;
    
    this.http.post(`${this.API_URL}/categories/export`, options, {
      responseType: 'blob'
    }).subscribe({
      next: (blob) => {
        this.isExporting = false;
        const fileName = `categories_export_${new Date().toISOString().slice(0, 10)}.${options.format}`;
        this.downloadFile(blob, fileName);
      },
      error: (error) => {
        this.isExporting = false;
        console.error('Dışa aktarma hatası', error);
        this.exportError = 'Kategoriler dışa aktarılırken bir hata oluştu';
      }
    });
  }

  private downloadFile(blob: Blob, fileName: string) {
    // Dosya indirme
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
  }
}