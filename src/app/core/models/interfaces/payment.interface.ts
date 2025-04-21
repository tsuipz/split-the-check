import { Timestamp } from '@angular/fire/firestore';
import { CategoryType, PaymentType } from '../types';
import { SplitType } from '@app/shared/components/payment/payment.form.service';
import { User } from './user.interface';

export interface PaymentSplit {
  memberId: string; // UID of the member being charged
  value: number; // The amount to be charged
}

export interface Payment {
  id: string; // Firestore-generated ID
  amount: number; // Total amount paid
  date: Timestamp; // Date of the payment
  currency: string; // e.g., 'USD', 'JPY'
  paidBy: {
    // UID of payer, or multiple payers with amount
    memberId: string;
    amount: number;
  }[];
  groupId: string; // ID of the group this payment belongs to
  paymentType: PaymentType; // 'check' = expense paid for group, 'debt' = repayment
  description: string; // Optional: What was paid for
  category: CategoryType; // Optional category
  splitType: SplitType; // How it's split
  splits: PaymentSplit[];
}

export interface MemberWithPayments {
  user: User;
  payments: Payment[];
  currencyCode: string;
  balance: number;
}
