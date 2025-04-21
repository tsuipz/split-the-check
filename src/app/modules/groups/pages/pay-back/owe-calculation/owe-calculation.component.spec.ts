import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OweCalculationComponent } from './owe-calculation.component';

describe('OweCalculationComponent', () => {
  let component: OweCalculationComponent;
  let fixture: ComponentFixture<OweCalculationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OweCalculationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OweCalculationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
