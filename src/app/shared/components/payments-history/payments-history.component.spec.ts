import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsHistoryComponent } from './payments-history.component';
import { provideMockStore } from '@ngrx/store/testing';

describe('PaymentHistoryComponent', () => {
  let component: PaymentsHistoryComponent;
  let fixture: ComponentFixture<PaymentsHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentsHistoryComponent],
      providers: [provideMockStore()],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentsHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
