import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditLogsService } from '../../../../core/services/audit-logs.service';
import { AuditLog } from '../../../../core/models/audit-log.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-audit-logs-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './audit-logs-list.component.html',
  styleUrls: ['./audit-logs-list.component.scss']
})
export class AuditLogsListComponent implements OnInit {
  auditLogs: AuditLog[] = [];
  isLoading = false;
  errorMessage = '';
  beginDate: string = '';
  endDate: string = '';

  constructor(private auditLogsService: AuditLogsService) {}

  ngOnInit(): void {
    this.fetchLogs();
  }

  fetchLogs(): void {
    this.isLoading = true;
    this.auditLogsService.fetchLogs({
      begin_date: this.beginDate ? new Date(this.beginDate) : undefined,
      end_date: this.endDate ? new Date(this.endDate) : undefined
    }).subscribe({
      next: logs => {
        this.auditLogs = logs;
        this.isLoading = false;
      },
      error: err => {
        this.errorMessage = err.message || 'Audit logları alınırken hata oluştu.';
        this.isLoading = false;
      }
    });
  }

  applyFilter(): void {
    this.fetchLogs();
  }

  clearFilter(): void {
    this.beginDate = '';
    this.endDate = '';
    this.fetchLogs();
  }

  getLevelBadgeClass(level: string): string {
    switch (level) {
      case 'INFO': return 'badge-info';
      case 'WARN': return 'badge-warn';
      case 'ERROR': return 'badge-error';
      case 'DEBUG': return 'badge-debug';
      default: return '';
    }
  }
}
