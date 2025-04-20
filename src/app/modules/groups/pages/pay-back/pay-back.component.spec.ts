import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayBackComponent } from './pay-back.component';

describe('PayBackComponent', () => {
  let component: PayBackComponent;
  let fixture: ComponentFixture<PayBackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayBackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
