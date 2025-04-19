import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ExpenseComponent } from './expense/expense.component';
import { MatButtonModule } from '@angular/material/button';
import { PaymentFormService } from './payment.form.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PaidByComponent } from './paid-by/paid-by.component';

const COMPONENTS = [ExpenseComponent, PaidByComponent];

const MUI = [MatProgressBarModule, MatButtonModule];

@Component({
  selector: 'app-payment',
  imports: [CommonModule, ...MUI, ...COMPONENTS],
  providers: [PaymentFormService],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentComponent {
  public form = this.paymentFormService.form;
  public progress: 30 | 60 | 90 | 100 = 30;

  constructor(
    private paymentFormService: PaymentFormService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  public get nextBtnText() {
    if (this.progress === 90) {
      return 'Save';
    }

    return 'Next';
  }

  public get previousBtnText() {
    if (this.progress === 30) {
      return 'Cancel';
    }

    return 'Previous';
  }

  nextStep() {
    const expense = this.form.controls.expense;
    const paidBy = this.form.controls.paidBy;

    if (this.progress === 30) {
      expense.markAsDirty();

      if (expense.valid) {
        this.progress = 60;
      }
    } else if (this.progress === 60) {
      paidBy.markAsDirty();

      if (paidBy.valid) {
        this.progress = 90;
      }
    }
  }

  previousStep() {
    if (this.progress === 30) {
      this.router.navigate(['..'], { relativeTo: this.activatedRoute });
    } else if (this.progress === 60) {
      this.progress = 30;
    } else if (this.progress === 90) {
      this.progress = 60;
    }
  }
}
