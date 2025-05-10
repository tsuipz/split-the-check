import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentVisualizationComponent } from './payment-visualization.component';

describe('PaymentVisualizationComponent', () => {
  let component: PaymentVisualizationComponent;
  let fixture: ComponentFixture<PaymentVisualizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentVisualizationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentVisualizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
