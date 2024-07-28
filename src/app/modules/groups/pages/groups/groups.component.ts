import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { DebtListComponent } from '@app/shared/components/debt-list/debt-list.component';
import { Group } from '@app/core/models/interfaces';

const GROUPS_DATA: Group[] = [
  { id: 1, groupName: 'Group 1', members: ['1', '2', '3'], amountSpent: 1240 },
];

const MAT_MODULES = [
  MatButtonModule,
  MatExpansionModule,
  MatIconModule,
  MatListModule,
  MatSlideToggleModule,
];

@Component({
  selector: 'app-groups',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    RouterOutlet,
    FormsModule,
    ...MAT_MODULES,
    DebtListComponent,
  ],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.scss',
})
export class GroupsComponent {
  public groups = GROUPS_DATA;
}
