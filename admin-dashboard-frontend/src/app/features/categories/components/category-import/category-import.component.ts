import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-category-import',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './category-import.component.html',
  styleUrls: ['./category-import.component.scss']
})
export class CategoryImportComponent {
  selectedFile: File | null = null;
  uploadProgress = 0;
  isUploading = false;
  uploadSuccess = false;
  uploadError = '';
  importResults: any = null;
  
  private readonly API_URL = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      this.uploadProgress = 0;
      this.uploadSuccess = false;
      this.uploadError = '';
      this.importResults = null;
    }
  }

  uploadFile() {
    if (!this.selectedFile) return;
    
    this.isUploading = true;
    this.uploadProgress = 0;
    
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    
    this.http.post(`${this.API_URL}/categories/import`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      finalize(() => this.isUploading = false)
    ).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round(100 * event.loaded / event.total);
        } else if (event.type === HttpEventType.Response) {
          this.uploadSuccess = true;
          this.importResults = event.body;
        }
      },
      error: (error) => {
        console.error('Yükleme hatası', error);
        this.uploadError = error.error?.message || 'Dosya yüklenirken bir hata oluştu';
      }
    });
  }

  // Excel şablon dosyasını indir
  downloadTemplate() {
    window.location.href = `${this.API_URL}/categories/template`;
  }
}