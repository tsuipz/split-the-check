import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PaymentsState } from './payments.reducer';
import { paymentsAdapter } from './payments.reducer';

export const FEATURE_NAME = 'payments';

export const selectPaymentsState =
  createFeatureSelector<PaymentsState>(FEATURE_NAME);

export const {
  selectIds: selectPaymentIds,
  selectEntities: selectPaymentEntities,
  selectAll: selectAllPayments,
  selectTotal: selectPaymentsTotal,
} = paymentsAdapter.getSelectors(selectPaymentsState);

export const selectPaymentsLoading = createSelector(
  selectPaymentsState,
  (state: PaymentsState) => state.loading,
);

export const selectPaymentsError = createSelector(
  selectPaymentsState,
  (state: PaymentsState) => state.error,
);

export const selectPaymentById = (id: string) =>
  createSelector(selectPaymentEntities, (entities) => entities[id]);
