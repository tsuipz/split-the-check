import { Component } from '@angular/core';
import {  Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'split-the-check';

  constructor(private router: Router) { }

  onSend() {
    this.router.navigate(['/login']);
  }
}
