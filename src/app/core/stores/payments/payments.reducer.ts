import { createReducer, on } from '@ngrx/store';
import * as PaymentsActions from './payments.actions';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Payment } from '@app/core/models/interfaces';

export interface PaymentsState extends EntityState<Payment> {
  loading: boolean;
  error: string | null;
}

export const paymentsAdapter: EntityAdapter<Payment> =
  createEntityAdapter<Payment>({
    selectId: (payment: Payment) => payment.id,
    sortComparer: (a: Payment, b: Payment) => b.date.seconds - a.date.seconds,
  });

export const initialPaymentsState: PaymentsState =
  paymentsAdapter.getInitialState({
    loading: false,
    error: null,
  });

export const paymentsReducer = createReducer(
  initialPaymentsState,

  // Load payments
  on(
    PaymentsActions.loadPayments,
    (state): PaymentsState => ({
      ...state,
      loading: true,
      error: null,
    }),
  ),
  on(
    PaymentsActions.loadPaymentsSuccess,
    (state, { payments }): PaymentsState =>
      paymentsAdapter.setAll(payments, { ...state, loading: false }),
  ),
  on(
    PaymentsActions.loadPaymentsFailure,
    (state, { error }): PaymentsState => ({
      ...state,
      loading: false,
      error: error.message,
    }),
  ),

  // Create payment
  on(
    PaymentsActions.createPayment,
    (state): PaymentsState => ({
      ...state,
      loading: true,
      error: null,
    }),
  ),
  on(
    PaymentsActions.createPaymentSuccess,
    (state, { payment }): PaymentsState =>
      paymentsAdapter.addOne(payment, { ...state, loading: false }),
  ),
  on(
    PaymentsActions.createPaymentFailure,
    (state, { error }): PaymentsState => ({
      ...state,
      loading: false,
      error: error.message,
    }),
  ),

  // Update payment
  on(
    PaymentsActions.updatePayment,
    (state): PaymentsState => ({
      ...state,
      loading: true,
      error: null,
    }),
  ),
  on(
    PaymentsActions.updatePaymentSuccess,
    (state, { payment }): PaymentsState =>
      paymentsAdapter.updateOne(
        { id: payment.id, changes: payment },
        { ...state, loading: false },
      ),
  ),
  on(
    PaymentsActions.updatePaymentFailure,
    (state, { error }): PaymentsState => ({
      ...state,
      loading: false,
      error: error.message,
    }),
  ),

  // Delete payment
  on(
    PaymentsActions.deletePayment,
    (state): PaymentsState => ({
      ...state,
      loading: true,
      error: null,
    }),
  ),
  on(
    PaymentsActions.deletePaymentSuccess,
    (state, { id }): PaymentsState =>
      paymentsAdapter.removeOne(id, { ...state, loading: false }),
  ),
  on(
    PaymentsActions.deletePaymentFailure,
    (state, { error }): PaymentsState => ({
      ...state,
      loading: false,
      error: error.message,
    }),
  ),

  // Get payments by group
  on(
    PaymentsActions.getPaymentsByGroup,
    (state): PaymentsState => ({ ...state, loading: true, error: null }),
  ),
  on(
    PaymentsActions.getPaymentsByGroupSuccess,
    (state, { payments }): PaymentsState =>
      paymentsAdapter.setAll(payments, { ...state, loading: false }),
  ),
  on(
    PaymentsActions.getPaymentsByGroupFailure,
    (state, { error }): PaymentsState => ({
      ...state,
      loading: false,
      error: error.message,
    }),
  ),
);
