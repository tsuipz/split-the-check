import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { DebtListComponent } from '@app/shared/components/debt-list/debt-list.component';
import { Group } from '@app/core/models/interfaces';
import { Store } from '@ngrx/store';
import { GroupsActions, GroupsSelectors } from '@app/core/stores/groups';
import { Timestamp } from '@angular/fire/firestore';
import { Router } from '@angular/router';

const GROUPS_DATA: Group[] = [
  {
    id: '1',
    name: 'Group 1',
    members: ['1', '2', '3'],
    totalSpent: 1240,
    adminOwners: ['1'],
    createdAt: Timestamp.now(),
  },
];

const MAT_MODULES = [
  MatButtonModule,
  MatExpansionModule,
  MatIconModule,
  MatListModule,
  MatSlideToggleModule,
  MatCardModule,
];

@Component({
  selector: 'app-groups',
  providers: [provideNativeDateAdapter()],
  imports: [CommonModule, FormsModule, ...MAT_MODULES, DebtListComponent],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.scss',
})
export class GroupsComponent implements OnInit {
  public groups$ = this.store.select(GroupsSelectors.selectAllGroups);
  public groups = GROUPS_DATA;

  constructor(private store: Store, private router: Router) {}

  ngOnInit(): void {
    this.store.dispatch(GroupsActions.loadGroups());
  }

  navigateToGroup(groupId: string): void {
    this.router.navigate(['/groups', groupId]);
  }

  onCreateGroup() {
    this.store.dispatch(GroupsActions.createGroup());
  }
}
