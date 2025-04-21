import { CommonModule } from '@angular/common';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Payment } from '@app/core/models/interfaces';

@Component({
  selector: 'app-owe-calculation',
  imports: [CommonModule],
  templateUrl: './owe-calculation.component.html',
  styleUrl: './owe-calculation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OweCalculationComponent {
  @Input() currentUserId = '';
  @Input() memberId = '';
  @Input() payments: Payment[] = [];

  public title: 'you owe' | 'owes you' | 'all paided' | 'no payments' =
    'no payments';

  private get balanceCalculation() {
    if (!this.payments?.length || !this.memberId) return 0;

    return this.handleBalanceCalculation();
  }

  public get userTitle() {
    if (this.payments.length === 0) {
      return 'no payments';
    }

    if (this.balanceCalculation === 0) {
      return 'all paided';
    }

    return this.balanceCalculation > 0 ? 'owes you' : 'you owe';
  }

  public get userPaidAmount(): number {
    return Math.abs(this.balanceCalculation);
  }

  public get currencyCode() {
    if (!this.payments.length) {
      return 'USD';
    }

    return this.payments[0].currency;
  }

  private handleBalanceCalculation() {
    let balance = 0;

    for (const payment of this.payments) {
      const totalPaid =
        payment.paidBy.reduce((sum, p) => sum + p.amount, 0) || 0;
      const payerMap = new Map(
        payment.paidBy.map((p) => [p.memberId, p.amount]),
      );

      for (const split of payment.splits) {
        const debtorId = split.memberId;
        const value = split.value;

        for (const [payerId, paidAmount] of payerMap.entries()) {
          if (payerId === debtorId) continue; // skip self-payment

          const share = (paidAmount / totalPaid) * value;

          const isCurrentUserPayer = payerId === this.currentUserId;
          const isMemberDebtor = debtorId === this.memberId;

          const isMemberPayer = payerId === this.memberId;
          const isCurrentUserDebtor = debtorId === this.currentUserId;

          // current user paid, member owes them
          if (isCurrentUserPayer && isMemberDebtor) {
            balance += share;
          }

          // member paid, current user owes them
          if (isMemberPayer && isCurrentUserDebtor) {
            balance -= share;
          }
        }
      }
    }

    return balance;
  }
}
