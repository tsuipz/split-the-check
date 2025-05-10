import { CommonModule } from '@angular/common';
import { Component, Input, computed, inject, Signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Payment, User } from '@app/core/models/interfaces';
import { selectCurrentUserId } from '@app/core/stores/auth/auth.selectors';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-group-balance-summary',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './group-balance-summary.component.html',
  styleUrls: ['./group-balance-summary.component.scss'],
})
export class GroupBalanceSummaryComponent {
  @Input() payments!: Signal<Payment[]>;
  @Input() users: User[] = [];

  private store = inject(Store);
  private currentUserId = this.store.selectSignal(selectCurrentUserId);

  public getUserName(userId: string): string {
    return (
      this.users.find((user) => user.id === userId)?.name || 'Unknown User'
    );
  }

  private calculateDebts() {
    const payments = this.payments();
    const debts: { userId: string; amount: number }[] = [];
    const currentUserId = this.currentUserId();

    payments.forEach((payment) => {
      // Calculate how much the current user paid
      const userPaidAmount = payment.paidBy
        .filter((p) => p.memberId === currentUserId)
        .reduce((sum, p) => sum + p.amount, 0);

      // Calculate how much the current user owes
      const userOwesAmount = payment.splits
        .filter((s) => s.memberId === currentUserId)
        .reduce((sum, s) => sum + s.value, 0);

      // For each other user in the payment
      payment.splits.forEach((split) => {
        if (split.memberId !== currentUserId) {
          const otherUserPaidAmount = payment.paidBy
            .filter((p) => p.memberId === split.memberId)
            .reduce((sum, p) => sum + p.amount, 0);

          // Calculate net amount between current user and other user
          const netAmount =
            userPaidAmount * (split.value / payment.amount) -
            otherUserPaidAmount * (userOwesAmount / payment.amount);

          const existingDebt = debts.find((d) => d.userId === split.memberId);
          if (existingDebt) {
            existingDebt.amount += netAmount;
          } else {
            debts.push({ userId: split.memberId, amount: netAmount });
          }
        }
      });
    });

    return debts;
  }

  public peopleWhoOweYou = computed(() => {
    return this.calculateDebts()
      .filter((debt) => debt.amount > 0)
      .sort((a, b) => b.amount - a.amount);
  });

  public peopleYouOwe = computed(() => {
    return this.calculateDebts()
      .filter((debt) => debt.amount < 0)
      .map((debt) => ({ ...debt, amount: Math.abs(debt.amount) }))
      .sort((a, b) => b.amount - a.amount);
  });

  public overallBalance = computed(() => {
    return this.calculateDebts().reduce((sum, debt) => sum + debt.amount, 0);
  });

  public totalSpentByUser = computed(() => {
    const payments = this.payments();
    const currentUserId = this.currentUserId();
    return payments
      .flatMap((payment) => payment.paidBy)
      .filter((p) => p.memberId === currentUserId)
      .reduce((sum, p) => sum + p.amount, 0);
  });

  public totalGroupPaid = computed(() => {
    const payments = this.payments();
    return payments.reduce((sum, payment) => sum + payment.amount, 0);
  });

  public currencyCode = computed(() => {
    const payments = this.payments();
    return payments.length > 0 ? payments[0].currency : 'USD';
  });
}
