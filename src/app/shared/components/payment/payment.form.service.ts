import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { FormControl, FormGroup } from '@angular/forms';
import { CURRENCY_OPTIONS } from '@app/core/models/constants';
import { Currency, User } from '@app/core/models/interfaces';
import { Category } from '@app/core/models/interfaces/category.interface';
export interface MultiplePayers {
  id: string;
  name: string;
  email: string;
  amount: number;
}

export interface MultiplePayersForm {
  id: FormControl<string | null>;
  name: FormControl<string | null>;
  email: FormControl<string | null>;
  amount: FormControl<number | null>;
}

export type MultiplePayersFormGroup = FormGroup<MultiplePayersForm>;

export type MultiplePayersFormArray = FormArray<MultiplePayersFormGroup>;

export interface ExpenseForm {
  description: FormControl<string | null>;
  currency: FormControl<Currency | null>;
  amount: FormControl<number | null>;
  category: FormControl<Category | null>;
}

export type ExpenseFormGroup = FormGroup<ExpenseForm>;

export type PayerByType = 'single' | 'multiple';

export interface PaidByForm {
  payerByType: FormControl<PayerByType | null>;
  singlePayer: FormControl<string[] | null>;
  multiplePayers: FormArray<MultiplePayersFormGroup>;
}

export type PaidByFormGroup = FormGroup<PaidByForm>;

export interface PaymentForm {
  expense: ExpenseFormGroup;
  paidBy: PaidByFormGroup;
}

export type PaymentFormGroup = FormGroup<PaymentForm>;

@Injectable()
export class PaymentFormService {
  private _form = this.fb.group<PaymentForm>({
    expense: this.fb.group<ExpenseForm>({
      category: this.fb.control<Category | null>({
        name: 'General',
        icon: 'receipt',
      }),
      description: this.fb.control(null, [Validators.required]),
      currency: this.fb.control(CURRENCY_OPTIONS[0]),
      amount: this.fb.control(null, [Validators.required, Validators.min(0)]),
    }),
    paidBy: this.fb.group<PaidByForm>({
      payerByType: this.fb.control('single'),
      singlePayer: this.fb.control<string[] | null>(null),
      multiplePayers: this.fb.array<MultiplePayersFormGroup>([], {
        validators: [this.multiplePayersValidator()],
      }),
    }),
  });

  public get form() {
    return this._form;
  }

  constructor(private fb: FormBuilder) {}

  public onSetupMultiplePayers(members: User[]) {
    if (members.length > 0) {
      const multiplePayers = this.form.controls.paidBy.controls.multiplePayers;
      multiplePayers.clear();
      members.forEach((member) => {
        const multiplePayer: MultiplePayersFormGroup = this.fb.group({
          id: new FormControl(member.id),
          name: new FormControl(member.name),
          email: new FormControl(member.email),
          amount: new FormControl<number | null>(null),
        });
        multiplePayers.push(multiplePayer);
      });
    }
  }

  private multiplePayersValidator(): ValidatorFn {
    return (control: AbstractControl<MultiplePayers[]>) => {
      const multiplePayers = control.value;
      const formGroup = control.parent?.parent as FormGroup<PaymentForm>;

      if (!formGroup) {
        return null;
      }

      const amount = formGroup.controls.expense.controls.amount.value;
      const payerByType = formGroup.controls.paidBy.controls.payerByType.value;

      if (payerByType === 'single') {
        return null;
      }

      const totalAmount = multiplePayers.reduce(
        (acc, payer) => acc + payer.amount,
        0,
      );
      if (totalAmount !== amount) {
        return { notEqual: true };
      }
      return null;
    };
  }
}
