import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentVisualizationComponent } from './payment-visualization.component';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { Payment, User } from '@app/core/models/interfaces';

describe('PaymentVisualizationComponent', () => {
  let component: PaymentVisualizationComponent;
  let fixture: ComponentFixture<PaymentVisualizationComponent>;

  const mockPayments: Payment[] = [];
  const mockUsers: User[] = [];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentVisualizationComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentVisualizationComponent);
    component = fixture.componentInstance;
    component.payments = signal(mockPayments);
    component.users = mockUsers;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
