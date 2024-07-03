import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    MatIconModule,
    MatListModule,
    MatTooltipModule,
    RouterModule,
    CommonModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  // Define the routeLinks array for the top
  public routeLinks = [
    {
      link: 'home',
      name: 'Home',
      icon: 'home',
      onclick: this.onNavigateToHome.bind(this),
    },
    {
      link: 'friends',
      name: 'Friends',
      icon: 'handshake',
      onclick: this.onNavigateToHome.bind(this),
    },
    {
      link: 'groups',
      name: 'Groups',
      icon: 'groups_2',
      onclick: this.onNavigateToAbout.bind(this),
    },
    {
      link: 'activity',
      name: 'Activity',
      icon: 'query_stats',
      onclick: this.onNavigateToAbout.bind(this),
    },
  ];

  // Define the routeLinks array for the bottom
  public bottomRouteLinks = [
    {
      link: 'settings',
      name: 'Settings',
      icon: 'settings',
      onclick: this.onNavigateToAbout.bind(this),
    },
    {
      link: 'logout',
      name: 'Logout',
      icon: 'logout',
      onclick: this.onLogout.bind(this),
    },
  ];

  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Logout the user
   */
  public async onLogout(): Promise<void> {
    await this.authService.onSignOut();
  }

  /**
   * Navigate to the home page
   */
  public onNavigateToHome(): void {
    this.router.navigate(['home']);
  }

  /**
   * Navigate to the about page
   */
  public onNavigateToAbout(): void {
    this.router.navigate(['home', 'about']);
  }
}
