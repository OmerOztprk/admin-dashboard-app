import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, HeaderComponent, FooterComponent]
})
export class AdminLayoutComponent implements OnInit {
  isSidebarCollapsed = false;
  isDarkMode = false;

  ngOnInit(): void {
    this.checkScreenSize();
    this.loadUserPreferences();
    window.addEventListener('resize', this.checkScreenSize.bind(this));
  }

  checkScreenSize(): void {
    if (window.innerWidth < 768) {
      this.isSidebarCollapsed = true;
    }
  }

  loadUserPreferences(): void {
    // localStorage'dan kullanıcı tercihlerini yükleme
    const darkModePref = localStorage.getItem('darkMode');
    if (darkModePref) {
      this.isDarkMode = darkModePref === 'true';
    }
    
    const sidebarPref = localStorage.getItem('sidebarCollapsed');
    if (sidebarPref && window.innerWidth >= 768) {
      this.isSidebarCollapsed = sidebarPref === 'true';
    }
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    localStorage.setItem('sidebarCollapsed', this.isSidebarCollapsed.toString());
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', this.isDarkMode.toString());
  }
}