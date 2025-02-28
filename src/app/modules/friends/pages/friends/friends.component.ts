import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';

export interface FriendElement {
  id: string;
  name: string;
  amount: number;
}

const ELEMENT_DATA: FriendElement[] = [
  { id: '1', name: 'Patrick 1', amount: 1 },
  { id: '2', name: 'Patrick 2', amount: 20 },
  { id: '3', name: 'Patrick 3', amount: 123 },
  { id: '4', name: 'Patrick 4', amount: 203 },
  { id: '5', name: 'Patrick 5', amount: -493 },
  { id: '6', name: 'Patrick 6', amount: 20192 },
  { id: '7', name: 'Patrick 7', amount: 2303 },
  { id: '8', name: 'Patrick 9', amount: 20192 },
];

@Component({
  selector: 'app-friends',
  imports: [CommonModule, MatTableModule],
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.scss',
})
export class FriendsComponent {
  public displayedColumns: string[] = ['name', 'weight'];
  public dataSource = ELEMENT_DATA;

  constructor(private router: Router) {}

  /**
   * On row click, navigate to the friend page
   * @param row - The row that was clicked
   */
  public onRowClick(row: FriendElement): void {
    this.router.navigate(['/friends', row.id]);
  }
}
