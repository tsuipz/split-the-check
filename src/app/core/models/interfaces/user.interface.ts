import { Debt } from './debt.interface';

export interface User {
  id: string; // Firebase Authentication UID
  name: string;
  email: string;
  groupIds: string[]; // Array of group IDs the user is part of
  settledDebts: Record<string, number>; // Keyed by user ID, amount they have settled or owe
}

export interface PersonDebt {
  personId: string;
  groupId: string;
  debts: Debt[];
}
