import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsService } from '../../../../core/services/stats.service';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-stats-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-overview.component.html',
  styleUrls: ['./stats-overview.component.scss']
})
export class StatsOverviewComponent implements OnInit {
  auditLogChart: any;
  userCount = 0;
  categoryCount = 0;

  constructor(private statsService: StatsService) {}

  ngOnInit(): void {
    this.loadAuditLogChart();
    this.loadUserStats();
    this.loadCategoryStats();
  }

  loadAuditLogChart(): void {
    this.statsService.getAuditLogStats().subscribe({
      next: (stats) => {
        const labels = stats.map(item => `${item._id.proc_type} - ${item._id.email}`);
        const data = stats.map(item => item.count);

        this.auditLogChart = new Chart('auditLogChart', {
          type: 'bar',
          data: {
            labels,
            datasets: [{
              label: 'İşlem Sayısı',
              data,
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            scales: {
              y: { beginAtZero: true }
            }
          }
        });
      },
      error: (err) => console.error('Audit Log Chart Error:', err.message)
    });
  }

  loadUserStats(): void {
    this.statsService.getUserCountStats().subscribe({
      next: (res) => {
        this.userCount = res.count;
      },
      error: (err) => console.error('User Count Error:', err.message)
    });
  }

  loadCategoryStats(): void {
    this.statsService.getUniqueCategoryStats().subscribe({
      next: (res) => {
        this.categoryCount = res.count;
      },
      error: (err) => console.error('Category Count Error:', err.message)
    });
  }
}
