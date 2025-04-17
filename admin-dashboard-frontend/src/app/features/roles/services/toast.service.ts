import { Injectable } from '@angular/core';

type ToastType = 'success' | 'danger' | 'warning' | 'info';

interface Toast {
  message: string;
  type: ToastType;
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts: Toast[] = [];
  private nextId = 0;
  
  constructor() { }
  
  show(message: string, type: ToastType = 'info'): void {
    const id = this.nextId++;
    this.toasts.push({ message, type, id });
    
    // 5 saniye sonra toast'ı otomatik kaldır
    setTimeout(() => this.remove(id), 5000);
  }
  
  getToasts(): Toast[] {
    return this.toasts;
  }
  
  remove(id: number): void {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }
  
  clear(): void {
    this.toasts = [];
  }
}