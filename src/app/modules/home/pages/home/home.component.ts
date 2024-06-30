import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  title = 'split-the-check';

  constructor(private authService: AuthService, private router: Router) {}

  public logout() {
    this.authService.signOut();
  }

  public navigateToAbout() {
    this.router.navigate(['home', 'about']);
  }
}
