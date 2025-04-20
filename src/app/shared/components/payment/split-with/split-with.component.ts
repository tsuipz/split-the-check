import {
  ChangeDetectionStrategy,
  Component,
  Input,
  signal,
} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {
  SplitMembersFormGroup,
  SplitType,
  SplitWithForm,
} from '../payment.form.service';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Currency } from '@app/core/models/interfaces';

const SPLIT_TYPE_OPTIONS: { label: string; value: SplitType }[] = [
  { label: '=', value: 'equal' },
  { label: '1.23', value: 'exact' },
  { label: '%', value: 'percentage' },
];

const MUI = [
  MatButtonToggleModule,
  MatListModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatInputModule,
];

@Component({
  selector: 'app-split-with',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ...MUI],
  templateUrl: './split-with.component.html',
  styleUrl: './split-with.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SplitWithComponent {
  @Input() form = this.fb.group<SplitWithForm>({
    splitType: this.fb.control('equal'),
    splitMembers: this.fb.array<SplitMembersFormGroup>([]),
  });
  @Input() currency = this.fb.control<Currency | null>({
    code: 'USD',
    symbol: '$',
    label: 'United States Dollar',
  });
  @Input() amount = this.fb.control<number | null>(null);

  public splitTypeOptions = SPLIT_TYPE_OPTIONS;

  public splitMembersErrorSignal = signal('');

  public get sumAmount() {
    return this.form.controls.splitMembers.value.reduce(
      (acc, member) => acc + (member.amount ?? 0),
      0,
    );
  }

  public get amountLeft() {
    return this.amount.value ? this.amount.value - this.sumAmount : 0;
  }

  public get percentageLeft() {
    const PERC = 100;
    return PERC - this.sumAmount;
  }

  constructor(private fb: FormBuilder) {}

  public onSplitMembersErrorMessage(): void {
    const splitMembers = this.form.controls.splitMembers;

    if (splitMembers.getError('noSelected')) {
      this.splitMembersErrorSignal.set('At least one member must be selected');
    } else if (splitMembers.getError('notExactEqual')) {
      this.splitMembersErrorSignal.set(
        'The total amount must be equal to the amount of the expense',
      );
    } else if (splitMembers.getError('notPercentageEqual')) {
      this.splitMembersErrorSignal.set(
        'The total amount must be equal to 100%',
      );
    } else {
      this.splitMembersErrorSignal.set('');
    }
  }
}
