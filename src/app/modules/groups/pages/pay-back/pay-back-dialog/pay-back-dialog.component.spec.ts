import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayBackDialogComponent } from './pay-back-dialog.component';

describe('PayBackDialogComponent', () => {
  let component: PayBackDialogComponent;
  let fixture: ComponentFixture<PayBackDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayBackDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayBackDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
