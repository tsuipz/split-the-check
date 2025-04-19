import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  CategoriesDialogComponent,
  Category,
} from './categories-dialog/categories-dialog.component';
import { take } from 'rxjs';
import { FormBuilder } from '@angular/forms';

const MUI = [MatButtonModule, MatIconModule];

@Component({
  selector: 'app-categories',
  imports: [...MUI],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesComponent {
  @Input() control = this.fb.control<Category | null>({
    name: 'General',
    icon: 'receipt',
  });

  constructor(private dialog: MatDialog, private fb: FormBuilder) {}

  openCategoriesDialog(): void {
    this.dialog
      .open(CategoriesDialogComponent, {
        data: {
          categories: [this.control.value],
        },
        width: '500px',
        height: '400px',
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((result: { selectedCategory: Category[] } | null) => {
        // If the dialog is saved with results and the category is selected, update the category
        if (result && result.selectedCategory.length > 0) {
          this.control.setValue(result.selectedCategory[0]);
        }
      });
  }
}
