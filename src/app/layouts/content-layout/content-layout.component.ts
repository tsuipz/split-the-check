import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterOutlet],
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
})
export class ContentLayoutComponent {}
