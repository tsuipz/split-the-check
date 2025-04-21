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
import { MatSelectModule } from '@angular/material/select';
import { CURRENCY_OPTIONS } from '@app/core/models/constants';
import { Currency, MemberWithPayments } from '@app/core/models/interfaces';
import { AmountFormComponent } from '@app/shared/components/amount-form/amount-form.component';
import { CurrencyFormComponent } from '@app/shared/components/currency-form/currency-form.component';

const COMPONENTS = [CurrencyFormComponent, AmountFormComponent];

const MUI = [
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatButtonModule,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
];

@Component({
  selector: 'app-pay-back-dialog',
  imports: [CommonModule, ReactiveFormsModule, ...MUI, ...COMPONENTS],
  templateUrl: './pay-back-dialog.component.html',
  styleUrl: './pay-back-dialog.component.scss',
})
export class PayBackDialogComponent {
  public readonly data = inject<MemberWithPayments>(MAT_DIALOG_DATA);
  public form = this.fb.group({
    currency: this.fb.control<Currency | null>(
      CURRENCY_OPTIONS.find(
        (currency) => this.data.currencyCode === currency.code,
      ) ?? CURRENCY_OPTIONS[0],
    ),
    amount: this.fb.control<number | null>(Math.abs(this.data.balance), [
      Validators.required,
      Validators.min(0),
    ]),
  });

  public get title(): string {
    if (this.data.balance < 0) {
      return `You paid ${this.data.user.name}`;
    }

    return `${this.data.user.name} paid you`;
  }

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PayBackDialogComponent>,
  ) {}

  public onNoClick() {
    this.dialogRef.close();
  }
}
