export interface PaymentSplit {
  memberId: string; // UID of the member being charged
  value: number; // For 'exact', the dollar amount; for 'percentage', the percent (e.g., 25 for 25%)
}

export interface Payment {
  id: string; // Firestore-generated ID
  amount: number; // Total amount paid
  date: Date; // Date of the payment
  currency: string; // e.g., 'USD', 'JPY'
  paidBy:
    | string
    | {
        // UID of payer, or multiple payers with amount
        memberId: string;
        amount: number;
      }[];
  groupId: string; // ID of the group this payment belongs to
  type: 'check' | 'debt'; // 'check' = expense paid for group, 'debt' = repayment
  description?: string; // Optional: What was paid for
  category?: 'General' | 'Dining Out' | 'Groceries'; // Optional category
  splitType: 'equal' | 'exact' | 'percentage'; // How it's split
  splits?: PaymentSplit[]; // Required if splitType !== 'equal'
}
