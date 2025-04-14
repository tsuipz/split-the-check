import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { User } from '@app/core/models/interfaces';
import { UsersService } from '@app/core/services/users.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';

const MATERIAL_MODULES = [
  MatDialogModule,
  MatInputModule,
  MatFormFieldModule,
  MatListModule,
  MatButtonModule,
  MatIconModule,
  MatChipsModule,
];

@Component({
  selector: 'app-user-search-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, ...MATERIAL_MODULES],
  templateUrl: './user-search-dialog.component.html',
  styleUrls: ['./user-search-dialog.component.scss'],
})
export class UserSearchDialogComponent {
  searchQuery = '';
  searchResults: User[] = [];
  selectedUsers: User[] = [];
  private searchSubject = new Subject<string>();

  constructor(
    private dialogRef: MatDialogRef<UserSearchDialogComponent>,
    private usersService: UsersService,
    @Inject(MAT_DIALOG_DATA) public data: { groupId: string },
  ) {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => this.usersService.searchUsers(query)),
      )
      .subscribe((users) => {
        this.searchResults = users;
      });
  }

  onSearchChange(query: string): void {
    this.searchSubject.next(query);
  }

  addUser(user: User): void {
    if (!this.selectedUsers.some((u) => u.id === user.id)) {
      this.selectedUsers.push(user);
    }
  }

  removeUser(user: User): void {
    const index = this.selectedUsers.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      this.selectedUsers.splice(index, 1);
    }
  }

  addSelectedUsers(): void {
    this.dialogRef.close(this.selectedUsers);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
