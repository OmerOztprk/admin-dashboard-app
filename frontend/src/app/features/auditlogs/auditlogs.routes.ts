import { Routes } from '@angular/router';

export const AUDITLOGS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/audit-logs-list/audit-logs-list.component').then(m => m.AuditLogsListComponent)
  }
];
