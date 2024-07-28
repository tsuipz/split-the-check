import { Debt } from './debt.interface';

export interface User {
  id: string;
  name: string;
}

export interface PersonDebt {
  personId: string;
  groupId: string;
  debts: Debt[];
}
