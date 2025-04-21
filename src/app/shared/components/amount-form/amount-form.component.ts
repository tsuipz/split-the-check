import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  signal,
  Input,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

const MUI = [MatFormFieldModule, MatInputModule];

@Component({
  selector: 'app-amount-form',
  imports: [CommonModule, ReactiveFormsModule, ...MUI],
  templateUrl: './amount-form.component.html',
  styleUrl: './amount-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AmountFormComponent {
  @Input() control = this.fb.control<number | null>(null, [
    Validators.required,
    Validators.min(0),
  ]);
  public amountErrorMessageSignal = signal('');

  constructor(private fb: FormBuilder) {}

  /**
   * Update the amount error message
   */
  public onAmountErrorMessageBlur() {
    const amount = this.control;

    if (amount.hasError('required')) {
      this.amountErrorMessageSignal.set('You must enter a value');
    } else if (amount.hasError('min')) {
      this.amountErrorMessageSignal.set('Value must be greater than 0');
    } else {
      this.amountErrorMessageSignal.set('');
    }
  }
}
