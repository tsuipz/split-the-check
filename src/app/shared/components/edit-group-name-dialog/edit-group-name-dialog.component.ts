import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

const MUI = [
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
];

@Component({
  selector: 'app-edit-group-name-dialog',
  templateUrl: './edit-group-name-dialog.component.html',
  styleUrls: ['./edit-group-name-dialog.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, ...MUI],
  standalone: true,
})
export class EditGroupNameDialogComponent {
  public readonly data = inject<{ name: string }>(MAT_DIALOG_DATA);
  public form = this.fb.group({
    name: this.fb.control(this.data.name, [Validators.required]),
  });

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditGroupNameDialogComponent>,
  ) {}

  public onNoClick() {
    this.dialogRef.close();
  }
}
