import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Input,
  Signal,
  signal,
} from '@angular/core';
import { Payment, User } from '@app/core/models/interfaces';
import { Category } from '@app/core/models/interfaces/category.interface';
import { CATEGORY_MAP } from '@app/core/models/constants/category.constant';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectCurrentUserId } from '@app/core/stores/auth/auth.selectors';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-payments-history',
  imports: [CommonModule],
  templateUrl: './payments-history.component.html',
  styleUrl: './payments-history.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentsHistoryComponent {
  @Input() users: Signal<User[]> = signal([]);
  @Input() payments: Signal<Payment[]> = signal([]);

  private currentUserIdSignal = toSignal(
    this.store.select(selectCurrentUserId),
  );

  constructor(private store: Store) {}

  private usersMapComp = computed(() => {
    return this.users().reduce((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {} as Record<string, User>);
  });

  public get CATEGORY_MAP(): Record<string, Category> {
    return CATEGORY_MAP;
  }

  public getPayer(paidBy: { memberId: string; amount: number }[]): string {
    if (paidBy.length === 1) {
      const payer = this.usersMapComp()[paidBy[0].memberId];
      const payerId = payer.id;
      const firstName = payer.name.split(' ')[0];

      if (payerId === this.currentUserIdSignal()) {
        return 'You';
      }

      return firstName;
    }

    return 'Multiple';
  }
}
