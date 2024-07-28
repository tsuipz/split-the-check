import { Injectable } from '@angular/core';
import { Group, PersonDebt, Receipt, User } from '@app/core/models/interfaces';
import { PayerHashMap } from '@app/core/models/types';

interface personBalance {
  personId: string;
  balance: number;
}

@Injectable()
export class DebtListService {
  /**
   * Calculate debts between group members
   * @param group - Group
   * @param recipts - Receipt[]
   * @param users - Record<string, User>
   * @param isChecked - boolean
   * @returns - PersonDebt[]
   */
  public calculateGroupDebts(
    group: Group,
    recipts: Receipt[],
    users: Record<string, User>,
    isChecked: boolean,
  ): PersonDebt[] {
    let personsHashDebts: PayerHashMap = {};

    recipts.forEach((receipt) => {
      const payer = users[receipt.payerId];
      const payee = users[receipt.payeeId];
      const amount = receipt.amount;

      // Check if payer exists in personsHashDebts
      if (!personsHashDebts[payer.id]) {
        personsHashDebts[payer.id] = {};
      }

      // Check if payee exists in personsHashDebts
      if (!personsHashDebts[payee.id]) {
        personsHashDebts[payee.id] = {};
      }

      // Check if payee exists in payer
      if (!personsHashDebts[payer.id][payee.id]) {
        personsHashDebts[payer.id][payee.id] = 0;
      }

      // Check if payer exists in payee
      if (!personsHashDebts[payee.id][payer.id]) {
        personsHashDebts[payee.id][payer.id] = 0;
      }

      // Get the debt between payer and payee
      personsHashDebts[payee.id][payer.id] -= amount;
      personsHashDebts[payer.id][payee.id] += amount;
    });

    // Optimize the debt if isChecked
    if (isChecked) {
      personsHashDebts = { ...this.calcOptimizeDebt(personsHashDebts) };
    }

    // Convert groupDebts to GroupDebtMap
    const personDebts: PersonDebt[] = [];
    group.members.forEach((member) => {
      personDebts.push({
        personId: member,
        groupId: group.id.toString(),
        debts: [],
      });
    });

    // calculate the debts for each person in each group
    personDebts.forEach((person) => {
      const debts = personsHashDebts[person.personId] || {};

      person.debts = Object.keys(debts).map((debtorId) => {
        return { personId: debtorId, amount: debts[debtorId] };
      });
    });

    return personDebts;
  }

  /**
   * Calculate optimized debt between group members
   * @param debt - GroupHashMap
   * @returns - GroupHashMap
   */
  public calcOptimizeDebt(debt: PayerHashMap): PayerHashMap {
    // Calculate net balance for each person
    const balances = this.calcNetBalance(debt);

    // Separate creditors and debtors
    // Sort creditors and debtors by balance
    const { creditors, debtors } = this.separateDebtorsAndCreditors(balances);

    // Settle debts
    const optimizedDebt: PayerHashMap = this.calcSettleDebts(
      creditors,
      debtors,
    );

    return optimizedDebt;
  }

  /**
   * Calculate the net balance of each person
   * @param payerHashMap - PayerHashMap
   * @returns - balances of each person
   */
  public calcNetBalance(payerHashMap: PayerHashMap): Record<string, number> {
    const balances: Record<string, number> = {};

    // Calculate net balance for each person
    for (const payerId in payerHashMap) {
      for (const payeeId in payerHashMap[payerId]) {
        const amount = payerHashMap[payerId][payeeId];

        balances[payerId] = (balances[payerId] || 0) + amount;
      }
    }

    return balances;
  }

  /**
   * Separate creditors and debtors
   * @param balances - Record<string, number>
   * @returns - { creditors: personBalance[], debtors: personBalance[] }
   */
  public separateDebtorsAndCreditors(balances: Record<string, number>): {
    creditors: personBalance[];
    debtors: personBalance[];
  } {
    const creditors: personBalance[] = [];
    const debtors: personBalance[] = [];

    for (const personId in balances) {
      if (balances[personId] > 0) {
        creditors.push({ personId, balance: balances[personId] });
      } else if (balances[personId] < 0) {
        debtors.push({ personId, balance: -balances[personId] });
      }
    }

    creditors.sort((a, b) => b.balance - a.balance);
    debtors.sort((a, b) => b.balance - a.balance);

    return { creditors, debtors };
  }

  /**
   * Settle debts between creditors and debtors
   * @param creditors - personBalance[]
   * @param debtors - personBalance[]
   * @returns - PayerHashMap
   */
  public calcSettleDebts(
    creditors: personBalance[],
    debtors: personBalance[],
  ): PayerHashMap {
    const optimizedDebt: PayerHashMap = {};

    // Settle debts
    let i = 0;
    let j = 0;
    while (i < creditors.length && j < debtors.length) {
      // Transfer the minimum amount between creditor and debtor
      const transferAmount = Math.min(creditors[i].balance, debtors[j].balance);

      // Check if creditor and debtor exists in optimizedDebt
      if (!optimizedDebt[creditors[i].personId]) {
        optimizedDebt[creditors[i].personId] = {};
      }
      if (!optimizedDebt[debtors[j].personId]) {
        optimizedDebt[debtors[j].personId] = {};
      }

      // Settle the debt between creditor and debtor
      optimizedDebt[creditors[i].personId][debtors[j].personId] =
        transferAmount === 0 ? 0 : transferAmount;
      optimizedDebt[debtors[j].personId][creditors[i].personId] =
        transferAmount === 0 ? 0 : -transferAmount;

      // Update the balance of creditor and debtor after transfer
      creditors[i].balance -= transferAmount;
      debtors[j].balance -= transferAmount;

      // Move to next creditor or debtor
      if (creditors[i].balance === 0) {
        i++;
      }
      if (debtors[j].balance === 0) {
        j++;
      }
    }

    return optimizedDebt;
  }
}
