import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebtListComponent } from './debt-list.component';
import { DebtListService } from './debt-list.service';

describe('DebtListComponent', () => {
  let component: DebtListComponent;
  let fixture: ComponentFixture<DebtListComponent>;
  let debtListServiceMock: jest.Mocked<DebtListService>;

  beforeEach(async () => {
    // mock services
    debtListServiceMock = {
      calculateGroupDebts: jest.fn(),
    } as unknown as jest.Mocked<DebtListService>;

    await TestBed.configureTestingModule({
      imports: [DebtListComponent],
    })
      .overrideProvider(DebtListService, { useValue: debtListServiceMock })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DebtListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onToggleChange', () => {
    beforeEach(() => {
      component.group = {
        id: '1',
        name: 'Group 1',
        members: ['1', '2', '3'],
        totalSpent: 1240,
        adminOwners: ['1'],
      };
    });

    it('should set the isChecked$ signal and calculate the person debts', () => {
      // Arrange
      const value = false;
      const personDebts = [
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
      jest.spyOn(component.isChecked$, 'set');
      jest.spyOn(component.personDebts$, 'set');
      debtListServiceMock.calculateGroupDebts.mockReturnValue(personDebts);

      // Act
      component.onToggleChange(value);

      // Assert
      expect(component.isChecked$.set).toHaveBeenCalledWith(value);
      expect(component.personDebts$.set).toHaveBeenCalledWith(personDebts);
    });

    it('should set the isChecked$ signal and calculate the person debts with the value true', () => {
      // Arrange
      const value = true;
      const personDebts = [
        {
          personId: '1',
          groupId: '1',
          debts: [
            { personId: '2', amount: 40 },
            { personId: '3', amount: 20 },
            { personId: '4', amount: -20 },
          ],
        },
        {
          personId: '2',
          groupId: '1',
          debts: [
            { personId: '1', amount: -40 },
            { personId: '3', amount: 20 },
            { personId: '4', amount: -20 },
          ],
        },
        {
          personId: '3',
          groupId: '1',
          debts: [
            { personId: '1', amount: -20 },
            { personId: '2', amount: -20 },
            { personId: '4', amount: 40 },
          ],
        },
        {
          personId: '4',
          groupId: '1',
          debts: [
            { personId: '1', amount: 20 },
            { personId: '2', amount: 20 },
            { personId: '3', amount: -40 },
          ],
        },
      ];
      jest.spyOn(component.isChecked$, 'set');
      jest.spyOn(component.personDebts$, 'set');
      debtListServiceMock.calculateGroupDebts.mockReturnValue(personDebts);

      // Act
      component.onToggleChange(value);

      // Assert
      expect(component.isChecked$.set).toHaveBeenCalledWith(value);
      expect(component.personDebts$.set).toHaveBeenCalledWith(personDebts);
    });
  });

  describe('onCalculateTotalPersonDebts', () => {
    it('should return the total amount of debts for the person', () => {
      // Arrange
      const personDebt = {
        personId: '1',
        groupId: '1',
        debts: [
          { personId: '2', amount: 40 },
          { personId: '3', amount: 20 },
          { personId: '4', amount: -20 },
        ],
      };
      const expected = -40;

      // Act
      const result = component.onCalculateTotalPersonDebts(personDebt);

      // Assert
      expect(result).toEqual(expected);
    });
  });

  describe('onDebtDescription', () => {
    it('should return the description of the debt', () => {
      // Arrange
      const debt = { personId: '1', amount: 20 };
      const expected = { owesText: 'Owes', toText: 'to', amount: 20 };

      // Act
      const result = component.onDebtDescription(debt);

      // Assert
      expect(result).toEqual(expected);
    });

    it('should return the description of the debt if the amount is negative', () => {
      // Arrange
      const debt = { personId: '1', amount: -20 };
      const expected = { owesText: 'Gets', toText: 'from', amount: 20 };

      // Act
      const result = component.onDebtDescription(debt);

      // Assert
      expect(result).toEqual(expected);
    });
  });
});
