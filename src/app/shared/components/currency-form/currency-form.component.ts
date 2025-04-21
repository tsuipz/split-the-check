import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CURRENCY_OPTIONS } from '@app/core/models/constants';
import { Currency } from '@app/core/models/interfaces';

const MUI = [MatFormFieldModule, MatSelectModule];

@Component({
  selector: 'app-currency-form',
  imports: [CommonModule, ReactiveFormsModule, ...MUI],
  templateUrl: './currency-form.component.html',
  styleUrl: './currency-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyFormComponent {
  @Input() control = this.fb.control<Currency | null>(CURRENCY_OPTIONS[0]);

  public currencyOptions: Currency[] = CURRENCY_OPTIONS;

  constructor(private fb: FormBuilder) {}

  public get currency() {
    const currency = this.control.value;
    return currency ? currency.symbol : '';
  }
}
