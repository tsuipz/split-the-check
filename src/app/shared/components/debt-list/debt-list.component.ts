import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DebtListService } from './debt-list.service';
import { User } from '@app/core/models/interfaces';

interface Group {
  id: number;
  groupName: string;
  members: string[];
  amountSpent: number;
}

interface PersonDebt {
  personId: string;
  groupId: string;
  debts: Debt[];
}

interface Debt {
  personId: string;
  amount: number;
}

interface DebtDescription {
  owesText: string;
  toText: string;
  amount: number;
}

interface Receipt {
  id: number;
  amount: number;
  payerId: string;
  payeeId: string;
  groupId: number;
}

const RECIPTS_DATA: Receipt[] = [
  { id: 1, amount: 20.0, payerId: '1', payeeId: '3', groupId: 1 },
  // { id: 2, amount: 0.0, payerId: '1', payeeId: '3', groupId: 1 },
  // { id: 3, amount: 0.0, payerId: '2', payeeId: '1', groupId: 1 },
  { id: 4, amount: 20.0, payerId: '3', payeeId: '2', groupId: 1 },
];

const USERS_DATA: Record<string, User> = {
  '1': {
    id: '1',
    name: 'John Smith',
    email: '',
    groupIds: [],
    settledDebts: {},
  },
  '2': {
    id: '2',
    name: 'Jane Smith',
    email: '',
    groupIds: [],
    settledDebts: {},
  },
  '3': { id: '3', name: 'John Doe', email: '', groupIds: [], settledDebts: {} },
};

const MAT_MODULES = [MatSlideToggleModule, MatListModule];

@Component({
  selector: 'app-debt-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ...MAT_MODULES],
  providers: [DebtListService],
  templateUrl: './debt-list.component.html',
  styleUrl: './debt-list.component.scss',
})
export class DebtListComponent implements OnInit {
  @Input() public group: Group = {
    id: 1,
    groupName: 'Group 1',
    members: ['1', '2', '3'],
    amountSpent: 1240,
  };
  public users = USERS_DATA;
  public isChecked$ = signal<boolean>(false);
  public personDebts$ = signal<PersonDebt[]>([]);

  constructor(private debtListService: DebtListService) {}

  public ngOnInit(): void {
    this.onToggleChange(false);
  }

  /**
   * Handles the change of the toggle
   * @param value - The value of the toggle
   */
  public onToggleChange(value: boolean): void {
    this.isChecked$.set(value);

    const personDebts = this.debtListService.calculateGroupDebts(
      this.group,
      RECIPTS_DATA,
      this.users,
      value,
    );

    this.personDebts$.set(personDebts);
  }

  /**
   *
   * @param personDebt - The person debt object
   * @returns - The total amount of debts for the person
   */
  public onCalculateTotalPersonDebts(personDebt: PersonDebt): number {
    return personDebt.debts.reduce((acc, debt) => acc - debt.amount, 0);
  }

  /**
   * Returns the description of the debt
   * @param debt - The debt object
   * @returns - The description of the debt
   */
  public onDebtDescription(debt: Debt): DebtDescription {
    const owesText = debt.amount > 0 ? 'Owes' : 'Gets';
    const toText = debt.amount > 0 ? 'to' : 'from';
    const amount = Math.abs(debt.amount);

    return { owesText, toText, amount };
  }
}
