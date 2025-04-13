import { TestBed } from '@angular/core/testing';
import { DebtListService } from './debt-list.service';
import { User, Group } from '@app/core/models/interfaces';
import { Timestamp } from '@angular/fire/firestore';
describe('DebtListService', () => {
  let service: DebtListService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DebtListService],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(DebtListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('calculateGroupDebts', () => {
    it('should return debts between group members', () => {
      // Arrange
      const group: Group = {
        id: '1',
        name: 'Group 1',
        members: ['1', '2', '3'],
        totalSpent: 40,
        adminOwners: ['1'],
        createdAt: Timestamp.now(),
      };
      const recipts = [
        { id: 1, amount: 20.0, payerId: '1', payeeId: '3', groupId: 1 },
        { id: 2, amount: 0.0, payerId: '1', payeeId: '3', groupId: 1 },
        { id: 3, amount: 0.0, payerId: '2', payeeId: '1', groupId: 1 },
        { id: 4, amount: 20.0, payerId: '3', payeeId: '2', groupId: 1 },
      ];
      const users: Record<string, User> = {
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
        '3': {
          id: '3',
          name: 'John Doe',
          email: '',
          groupIds: [],
          settledDebts: {},
        },
      };
      const isChecked = false;
      const expected = [
        {
          personId: '1',
          groupId: '1',
          debts: [
            { personId: '2', amount: 0 },
            { personId: '3', amount: 20 },
          ],
        },
        {
          personId: '2',
          groupId: '1',
          debts: [
            { personId: '1', amount: 0 },
            { personId: '3', amount: -20 },
          ],
        },
        {
          personId: '3',
          groupId: '1',
          debts: [
            { personId: '1', amount: -20 },
            { personId: '2', amount: 20 },
          ],
        },
      ];

      // Act
      const result = service.calculateGroupDebts(
        group,
        recipts,
        users,
        isChecked,
      );

      // Assert
      expect(result).toEqual(expected);
    });

    it('should return debts between group members if isChecked is true', () => {
      // Arrange
      const group: Group = {
        id: '1',
        name: 'Group 1',
        members: ['1', '2', '3'],
        totalSpent: 40,
        adminOwners: ['1'],
        createdAt: Timestamp.now(),
      };
      const recipts = [
        { id: 1, amount: 20.0, payerId: '1', payeeId: '3', groupId: 1 },
        { id: 2, amount: 0.0, payerId: '1', payeeId: '3', groupId: 1 },
        { id: 3, amount: 0.0, payerId: '2', payeeId: '1', groupId: 1 },
        { id: 4, amount: 20.0, payerId: '3', payeeId: '2', groupId: 1 },
      ];
      const users = {
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
        '3': {
          id: '3',
          name: 'John Doe',
          email: '',
          groupIds: [],
          settledDebts: {},
        },
      };
      const isChecked = true;
      const expected = [
        {
          personId: '1',
          groupId: '1',
          debts: [
            {
              personId: '2',
              amount: 20,
            },
          ],
        },
        {
          personId: '2',
          groupId: '1',
          debts: [
            {
              personId: '1',
              amount: -20,
            },
          ],
        },
        {
          personId: '3',
          groupId: '1',
          debts: [],
        },
      ];

      // Act
      const result = service.calculateGroupDebts(
        group,
        recipts,
        users,
        isChecked,
      );

      // Assert
      expect(result).toEqual(expected);
    });
  });

  describe('calcOptimizeDebt', () => {
    it('should return optimized debt if no one owes money', () => {
      // Arrange
      const groupDebts = {
        1: {
          3: -20,
        },
        2: {
          3: 20,
        },
        3: {
          1: 20,
          2: -20,
        },
      };
      const expected = {
        1: {
          2: -20,
        },
        2: {
          1: 20,
        },
      };

      // Act
      const result = service.calcOptimizeDebt(groupDebts);

      // Assert
      expect(result).toEqual(expected);
    });
  });

  describe('calcNetBalance', () => {
    it('should return net balance for each person', () => {
      // Arrange
      const groupDebts = {
        1: {
          3: -20,
        },
        2: {
          3: 20,
        },
        3: {
          1: 20,
          2: -20,
        },
      };
      const expected = {
        1: -20,
        2: 20,
        3: 0,
      };

      // Act
      const result = service.calcNetBalance(groupDebts);

      // Assert
      expect(result).toEqual(expected);
    });

    it('should return net balance for each person if no one owes money', () => {
      // Arrange
      const groupDebts = {
        1: {
          3: 0,
        },
        2: {
          3: 0,
        },
        3: {
          1: 0,
          2: 0,
        },
      };
      const expected = {
        1: 0,
        2: 0,
        3: 0,
      };

      // Act
      const result = service.calcNetBalance(groupDebts);

      // Assert
      expect(result).toEqual(expected);
    });

    it('should return net balance for each person if everyone owes money', () => {
      // Arrange
      const groupDebts = {
        1: {
          3: -20,
        },
        2: {
          3: -20,
        },
        3: {
          1: 20,
          2: 20,
        },
      };
      const expected = {
        1: -20,
        2: -20,
        3: 40,
      };

      // Act
      const result = service.calcNetBalance(groupDebts);

      // Assert
      expect(result).toEqual(expected);
    });

    it('should return net balance with 0 net balances', () => {
      // Arrange
      const groupDebts = {
        1: {
          3: -20,
        },
        2: {
          3: 20,
        },
        3: {
          1: 20,
          2: -20,
        },
      };
      const expected = {
        1: -20,
        2: 20,
        3: 0,
      };

      // Act
      const result = service.calcNetBalance(groupDebts);

      // Assert
      expect(result).toEqual(expected);
    });
  });

  describe('separateDebtorsAndCreditors', () => {
    it('should return debtors and creditors', () => {
      // Arrange
      const balances = {
        1: -20,
        2: 20,
        3: 0,
      };
      const expected = {
        creditors: [{ personId: '2', balance: 20 }],
        debtors: [{ personId: '1', balance: 20 }],
      };

      // Act
      const result = service.separateDebtorsAndCreditors(balances);

      // Assert
      expect(result).toEqual(expected);
    });
  });

  describe('calcSettleDebts', () => {
    it('should return the settled debts', () => {
      // Arrange
      const creditors = [{ personId: '2', balance: 20 }];
      const debtors = [{ personId: '1', balance: 20 }];
      const expected = {
        1: {
          2: -20,
        },
        2: {
          1: 20,
        },
      };

      // Act
      const result = service.calcSettleDebts(creditors, debtors);

      // Assert
      expect(result).toEqual(expected);
    });

    it('should return the settled debts if no one owes money', () => {
      // Arrange
      const creditors = [{ personId: '2', balance: 0 }];
      const debtors = [{ personId: '1', balance: 0 }];
      const expected = {
        1: {
          2: 0,
        },
        2: {
          1: 0,
        },
      };

      // Act
      const result = service.calcSettleDebts(creditors, debtors);

      // Assert
      expect(result).toEqual(expected);
    });

    it('should return the settled debts if everyone owes money', () => {
      // Arrange
      const creditors = [
        { personId: '2', balance: 20 },
        { personId: '3', balance: 20 },
        { personId: '4', balance: 20 },
      ];
      const debtors = [
        { personId: '1', balance: 40 },
        { personId: '5', balance: 20 },
        { personId: '6', balance: 20 },
      ];
      const expected = {
        '1': {
          '2': -20,
          '3': -20,
        },
        '2': {
          '1': 20,
        },
        '3': {
          '1': 20,
        },
        '4': {
          '5': 20,
        },
        '5': {
          '4': -20,
        },
      };

      // Act
      const result = service.calcSettleDebts(creditors, debtors);

      // Assert
      expect(result).toEqual(expected);
    });
  });
});
