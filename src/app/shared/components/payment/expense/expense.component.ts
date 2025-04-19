import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  signal,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CategoriesComponent } from './categories/categories.component';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Currency } from '@app/core/models/interfaces';
import { CURRENCY_OPTIONS } from '@app/core/models/constants';
import { ExpenseForm } from '../payment.form.service';
import { Category } from '@app/core/models/interfaces/category.interface';
const COMPONENTS = [CategoriesComponent];

const MUI = [MatFormFieldModule, MatInputModule, MatSelectModule];

@Component({
  selector: 'app-expense',
  imports: [CommonModule, ReactiveFormsModule, ...MUI, ...COMPONENTS],
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseComponent {
  @Input() form = this.fb.group<ExpenseForm>({
    category: this.fb.control<Category | null>({
      name: 'General',
      icon: 'receipt',
    }),
    description: this.fb.control(null, [Validators.required]),
    currency: this.fb.control(CURRENCY_OPTIONS[0]),
    amount: this.fb.control(null, [Validators.required, Validators.min(0)]),
  });

  amountErrorMessage = signal('');

  public currencyOptions: Currency[] = CURRENCY_OPTIONS;

  public get currency() {
    const currency = this.form.controls.currency.value;
    return currency ? currency.symbol : '';
  }

  constructor(private fb: FormBuilder) {}

  updateAmountErrorMessage() {
    const amount = this.form.controls.amount;

    if (amount.hasError('required')) {
      this.amountErrorMessage.set('You must enter a value');
    } else if (amount.hasError('min')) {
      this.amountErrorMessage.set('Value must be greater than 0');
    } else {
      this.amountErrorMessage.set('');
    }
  }
}
