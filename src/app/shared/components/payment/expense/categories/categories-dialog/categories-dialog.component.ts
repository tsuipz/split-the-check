import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category } from '@app/core/models/interfaces/category.interface';
import { CATEGORIES } from '@app/core/models/constants/category.constant';

const MUI = [MatListModule, MatIconModule, MatDialogModule, MatButtonModule];

@Component({
  selector: 'app-categories-dialog',
  imports: [ReactiveFormsModule, ...MUI],
  templateUrl: './categories-dialog.component.html',
  styleUrl: './categories-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesDialogComponent {
  public form = this.fb.group({
    selectedCategory: this.fb.control<Category[]>([], [Validators.required]),
  });

  public categories: Category[] = CATEGORIES;

  constructor(private fb: FormBuilder) {}
}
