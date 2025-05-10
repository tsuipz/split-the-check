import { CommonModule } from '@angular/common';
import { Component, Input, computed, Signal } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatCardModule } from '@angular/material/card';
import { Payment, User } from '@app/core/models/interfaces';

@Component({
  selector: 'app-payment-visualization',
  standalone: true,
  imports: [CommonModule, NgxChartsModule, MatCardModule],
  templateUrl: './payment-visualization.component.html',
  styleUrls: ['./payment-visualization.component.scss'],
})
export class PaymentVisualizationComponent {
  @Input() payments!: Signal<Payment[]>;
  @Input() users: User[] = [];

  // Chart options
  view: [number, number] = [700, 400];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Members';
  showYAxisLabel = true;
  yAxisLabel = 'Amount';

  // Find the first non-USD currency in payments, otherwise default to USD
  public chartCurrency = computed(() => {
    const payments = this.payments();
    const found = payments.find((p) => p.currency && p.currency !== 'USD');
    return found?.currency || 'USD';
  });

  // Process data for the chart
  public chartData = computed(() => {
    const payments = this.payments();
    const memberPayments = new Map<string, number>();

    // Only process 'check' type payments
    payments
      .filter((payment) => payment.paymentType === 'check')
      .forEach((payment) => {
        payment.paidBy.forEach((payer) => {
          const currentAmount = memberPayments.get(payer.memberId) || 0;
          memberPayments.set(payer.memberId, currentAmount + payer.amount);
        });
      });

    // Convert to chart data format
    return Array.from(memberPayments.entries())
      .map(([memberId, amount]) => {
        const user = this.users.find((u) => u.id === memberId);
        return {
          name: user?.name || 'Unknown',
          value: amount,
        };
      })
      .sort((a, b) => b.value - a.value); // Sort by amount descending
  });

  // Format the y-axis values with the chosen currency
  yAxisTickFormatting = (value: number) => {
    const currency = this.chartCurrency();
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(value);
  };
}
