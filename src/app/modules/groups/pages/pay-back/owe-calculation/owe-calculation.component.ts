import { CommonModule } from '@angular/common';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-owe-calculation',
  imports: [CommonModule],
  templateUrl: './owe-calculation.component.html',
  styleUrl: './owe-calculation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OweCalculationComponent {
  @Input() balance = 0;
  @Input() currencyCode = 'USD';

  public title: 'you owe' | 'owes you' | 'all paided' = 'all paided';

  public get userTitle() {
    if (this.balance === 0) {
      return 'all paided';
    }

    return this.balance > 0 ? 'owes you' : 'you owe';
  }

  public get userPaidAmount(): number {
    return Math.abs(this.balance);
  }
}
