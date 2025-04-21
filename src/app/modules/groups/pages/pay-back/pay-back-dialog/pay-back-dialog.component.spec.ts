import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PayBackDialogComponent } from './pay-back-dialog.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('PayBackDialogComponent', () => {
  let component: PayBackDialogComponent;
  let fixture: ComponentFixture<PayBackDialogComponent>;
  let mockDialogRef: jest.Mocked<MatDialogRef<PayBackDialogComponent>>;
  const mockData = {
    user: {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      groupIds: [],
      settledDebts: {},
    },
    balance: -100,
    currencyCode: 'USD',
  };

  beforeEach(async () => {
    mockDialogRef = {
      close: jest.fn(),
    } as unknown as jest.Mocked<MatDialogRef<PayBackDialogComponent>>;

    await TestBed.configureTestingModule({
      imports: [PayBackDialogComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockData },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayBackDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
