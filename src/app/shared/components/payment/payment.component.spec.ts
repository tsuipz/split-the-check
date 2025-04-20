import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentComponent } from './payment.component';
import { PaymentFormService } from './payment.form.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { selectGroupId } from '@app/core/stores/router/router.selectors';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { FormGroup, FormControl } from '@angular/forms';
import { Currency } from '@app/core/models/interfaces/currency.interface';

describe('PaymentComponent', () => {
  let component: PaymentComponent;
  let fixture: ComponentFixture<PaymentComponent>;
  let store: MockStore;
  let mockRouter: jest.Mocked<Router>;
  let mockActivatedRoute: jest.Mocked<ActivatedRoute>;
  let mockPaymentFormService: jest.Mocked<PaymentFormService>;

  beforeEach(async () => {
    mockRouter = {
      navigate: jest.fn(),
    } as any;

    mockActivatedRoute = {
      params: of({}),
    } as any;

    const formGroup = new FormGroup({
      expense: new FormGroup({
        amount: new FormControl(''),
        description: new FormControl(''),
        currency: new FormControl<Currency>({
          label: 'US Dollar',
          symbol: '$',
          code: 'USD',
        }),
      }),
      paidBy: new FormGroup({
        payerByType: new FormControl('single'),
        singlePayer: new FormControl([]),
        multiplePayers: new FormControl([]),
      }),
      splitWith: new FormGroup({
        splitType: new FormControl('equal'),
        members: new FormControl([]),
      }),
    });

    mockPaymentFormService = {
      form: formGroup,
      onSubmit: jest.fn(),
      onSetupMultiplePayers: jest.fn(),
      onSetupSplitMembers: jest.fn(),
      onIsHideMultiplePayers: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      providers: [
        provideMockStore(),
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: PaymentFormService, useValue: mockPaymentFormService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(PaymentComponent);
    store.overrideSelector(selectGroupId, 'test-group-id');
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
