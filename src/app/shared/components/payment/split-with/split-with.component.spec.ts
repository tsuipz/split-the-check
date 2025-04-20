import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SplitWithComponent } from './split-with.component';

describe('SplitWithComponent', () => {
  let component: SplitWithComponent;
  let fixture: ComponentFixture<SplitWithComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SplitWithComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SplitWithComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
