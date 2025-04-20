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

export type SplitType = 'equal' | 'exact' | 'percentage';

export interface SplitMembers {
  id: string;
  name: string;
  email: string;
  selected: boolean;
  amount: number;
}

export interface SplitMembersForm {
  id: FormControl<string | null>;
  name: FormControl<string | null>;
  email: FormControl<string | null>;
  selected: FormControl<boolean | null>;
  amount: FormControl<number | null>;
}

export type SplitMembersFormGroup = FormGroup<SplitMembersForm>;

export type SplitMembersFormArray = FormArray<SplitMembersFormGroup>;

export interface SplitWith {
  splitType: SplitType;
}

export interface SplitWithForm {
  splitType: FormControl<SplitType | null>;
  splitMembers: SplitMembersFormArray;
}

export type SplitWithFormGroup = FormGroup<SplitWithForm>;

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
  splitWith: SplitWithFormGroup;
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
    splitWith: this.fb.group<SplitWithForm>({
      splitType: this.fb.control('equal'),
      splitMembers: this.fb.array<SplitMembersFormGroup>([], {
        validators: [
          this.handleEqualValidator(),
          this.handleExactValidator(),
          this.handlePercentageValidator(),
        ],
      }),
    }),
  });

  public get form() {
    return this._form;
  }

  public get paidBy() {
    return this.form.controls.paidBy;
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

  public onSetupSplitMembers(members: User[]) {
    if (members.length > 0) {
      const splitMembers = this.form.controls.splitWith.controls.splitMembers;
      splitMembers.clear();
      members.forEach((member) => {
        const splitMember: SplitMembersFormGroup = this.fb.group({
          id: new FormControl(member.id),
          name: new FormControl(member.name),
          email: new FormControl(member.email),
          selected: new FormControl(true),
          amount: new FormControl<number | null>(null),
        });
        splitMembers.push(splitMember);
      });
    }
  }

  public onIsHideMultiplePayers() {
    const payerByType = this.paidBy.controls.payerByType.value;
    if (payerByType === 'multiple') {
      this.paidBy.controls.multiplePayers.enable();
    } else {
      this.paidBy.controls.multiplePayers.disable();
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

  private handleEqualValidator(): ValidatorFn {
    return (control: AbstractControl<SplitMembers[]>) => {
      const splitMembers = control.value;
      const parentGroup = control.parent as SplitWithFormGroup;

      if (!parentGroup) {
        return null;
      }

      const splitType = parentGroup.controls.splitType.value;

      if (splitType !== 'equal') {
        return null;
      }

      const isSomeSelected = splitMembers.some((member) => member.selected);

      if (!isSomeSelected) {
        return { noSelected: true };
      }

      return null;
    };
  }

  private handleExactValidator(): ValidatorFn {
    return (control: AbstractControl<SplitMembers[]>) => {
      const splitMembers = control.value;
      const parentGroup = control.parent as SplitWithFormGroup;
      const formGroup = control.parent?.parent as FormGroup<PaymentForm>;

      if (!parentGroup || !formGroup) {
        return null;
      }

      const splitType = parentGroup.controls.splitType.value;
      const amount = formGroup.controls.expense.controls.amount.value;

      if (splitType !== 'exact') {
        return null;
      }

      const totalAmount = splitMembers.reduce(
        (acc, member) => acc + member.amount,
        0,
      );

      if (totalAmount !== amount) {
        return { notExactEqual: true };
      }

      return null;
    };
  }

  private handlePercentageValidator(): ValidatorFn {
    const TOTAL_PERCENTAGE = 100;

    return (control: AbstractControl<SplitMembers[]>) => {
      const splitMembers = control.value;
      const parentGroup = control.parent as SplitWithFormGroup;

      if (!parentGroup) {
        return null;
      }

      const splitType = parentGroup.controls.splitType.value;

      if (splitType !== 'percentage') {
        return null;
      }

      const totalAmount = splitMembers.reduce(
        (acc, member) => acc + member.amount,
        0,
      );

      if (totalAmount !== TOTAL_PERCENTAGE) {
        return { notPercentageEqual: true };
      }

      return null;
    };
  }
}
