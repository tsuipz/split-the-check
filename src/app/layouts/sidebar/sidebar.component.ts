import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthActions } from '@app/core/stores/auth';

@Component({
    selector: 'app-sidebar',
    imports: [
        MatIconModule,
        MatListModule,
        MatTooltipModule,
        RouterModule,
        CommonModule,
    ],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
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
      onclick: this.onNavigateToFriends.bind(this),
    },
    {
      link: 'groups',
      name: 'Groups',
      icon: 'groups_2',
      onclick: this.onNavigateToGroups.bind(this),
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

  constructor(private router: Router, private store: Store) {}

  /**
   * Logout the user
   */
  public onLogout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  /**
   * Navigate to the home page
   */
  private onNavigateToHome(): void {
    this.router.navigate(['home']);
  }

  /**
   * Navigate to the friends page
   */
  private onNavigateToFriends(): void {
    this.router.navigate(['friends']);
  }

  /**
   * Navigate to the about page
   */
  private onNavigateToGroups(): void {
    this.router.navigate(['groups']);
  }

  /**
   * Navigate to the about page
   */
  private onNavigateToAbout(): void {
    this.router.navigate(['home', 'about']);
  }
}
