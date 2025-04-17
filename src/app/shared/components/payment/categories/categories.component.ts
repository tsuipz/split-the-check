import { Component, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  CategoriesDialogComponent,
  Category,
} from './categories-dialog/categories-dialog.component';
import { take } from 'rxjs';

const MUI = [MatButtonModule, MatIconModule];

@Component({
  selector: 'app-categories',
  imports: [...MUI],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent {
  public category = signal<Category>({
    name: 'General',
    icon: 'receipt',
  });

  constructor(private dialog: MatDialog) {}

  openCategoriesDialog(): void {
    this.dialog
      .open(CategoriesDialogComponent, {
        data: {
          categories: [this.category()],
        },
        width: '500px',
        height: '400px',
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((result: { selectedCategory: Category[] } | null) => {
        // If the dialog is saved with results and the category is selected, update the category
        if (result && result.selectedCategory.length > 0) {
          this.category.set(result.selectedCategory[0]);
        }
      });
  }
}
