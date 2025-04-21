import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PayBackComponent } from './pay-back.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayContainer } from '@angular/cdk/overlay';
import { AuthSelectors } from '@app/core/stores/auth';
import { selectGroupId } from '@app/core/stores/router/router.selectors';

describe('PayBackComponent', () => {
  let component: PayBackComponent;
  let fixture: ComponentFixture<PayBackComponent>;
  let store: MockStore;
  let mockDialog: jest.Mocked<MatDialog>;
  let overlayContainer: OverlayContainer;

  const initialState = {
    auth: {
      userId: '1',
    },
    groups: {
      selectedGroupId: '1',
    },
  };

  beforeEach(async () => {
    const mockDialogRef = {
      afterClosed: jest.fn().mockReturnValue(of(null)),
    };

    mockDialog = {
      open: jest.fn().mockReturnValue(mockDialogRef),
    } as unknown as jest.Mocked<MatDialog>;

    await TestBed.configureTestingModule({
      imports: [PayBackComponent, MatDialogModule, BrowserAnimationsModule],
      providers: [
        provideMockStore({ initialState }),
        { provide: MatDialog, useValue: mockDialog },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    store.overrideSelector(AuthSelectors.selectCurrentUserId, '1');
    store.overrideSelector(selectGroupId, '1');

    overlayContainer = TestBed.inject(OverlayContainer);
    fixture = TestBed.createComponent(PayBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
    store.resetSelectors();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
