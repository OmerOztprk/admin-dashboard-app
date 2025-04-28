import { Routes } from '@angular/router';

export const STATS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/stats-overview/stats-overview.component').then(m => m.StatsOverviewComponent)
  }
];
