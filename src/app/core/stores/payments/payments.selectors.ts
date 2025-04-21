import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PaymentsState } from './payments.reducer';
import { paymentsAdapter } from './payments.reducer';
import { selectCurrentUserId } from '../auth/auth.selectors';

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

/**
 * Select payments by group id
 * @param groupId - Group id
 * @returns Payments
 */
export const selectPaymentsByGroupId = (groupId: string) =>
  createSelector(selectAllPayments, (payments) =>
    payments.filter((payment) => payment.groupId === groupId),
  );

export const selectPaymentsByGroupIdAndUserId = (groupId: string) => {
  return createSelector(
    selectPaymentsByGroupId(groupId),
    selectCurrentUserId,
    (payments, currentUserId) => {
      if (!currentUserId || payments.length === 0) {
        return [];
      }

      return payments.filter((payment) => {
        // Check if the current user is a payer from the payment
        const isPayer = payment.paidBy.some(
          (payer) => payer.memberId === currentUserId,
        );
        const isPayee = payment.splits.some(
          (split) => split.memberId === currentUserId,
        );

        return isPayer || isPayee;
      });
    },
  );
};
