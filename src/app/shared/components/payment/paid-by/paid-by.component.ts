import {
  ChangeDetectionStrategy,
  Component,
  signal,
  Input,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatListModule } from '@angular/material/list';
import { Currency, User } from '@app/core/models/interfaces';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MultiplePayersFormGroup, PaidByForm } from '../payment.form.service';

const MUI = [
  MatButtonToggleModule,
  MatListModule,
  MatFormFieldModule,
  MatInputModule,
];

@Component({
  selector: 'app-paid-by',
  imports: [CommonModule, ReactiveFormsModule, ...MUI],
  templateUrl: './paid-by.component.html',
  styleUrl: './paid-by.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaidByComponent {
  @Input() form = this.fb.group<PaidByForm>({
    payerByType: this.fb.control('single'),
    singlePayer: this.fb.control(null),
    multiplePayers: this.fb.array<MultiplePayersFormGroup>([]),
  });
  @Input() currency = this.fb.control<Currency | null>({
    code: 'USD',
    symbol: '$',
    label: 'United States Dollar',
  });
  @Input() amount = this.fb.control<number | null>(100);
  @Input() members: User[] = [];

  public multiplePayersErrorSignal = signal('');

  public get sumAmount() {
    return this.form.controls.multiplePayers.value.reduce(
      (acc, payer) => acc + (payer.amount ?? 0),
      0,
    );
  }

  public get amountLeft() {
    return this.amount.value ? this.amount.value - this.sumAmount : 0;
  }

  constructor(private fb: FormBuilder) {}

  public onMultiplePayersErrorMessage() {
    const multiplePayers = this.form.controls.multiplePayers;

    if (multiplePayers.getError('notEqual')) {
      this.multiplePayersErrorSignal.set(
        'The total amount paid must be equal to the amount of the expense',
      );
    } else {
      this.multiplePayersErrorSignal.set('');
    }
  }
}
