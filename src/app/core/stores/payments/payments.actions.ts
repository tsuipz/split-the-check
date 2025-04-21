import { HttpErrorResponse } from '@angular/common/http';
import { Payment } from '@app/core/models/interfaces';
import { createAction, props } from '@ngrx/store';

/**
 * Load payments actions
 */
export const loadPayments = createAction('[Payments] Load Payments');

export const loadPaymentsSuccess = createAction(
  '[Payments] Load Payments Success',
  props<{ payments: Payment[] }>(),
);

export const loadPaymentsFailure = createAction(
  '[Payments] Load Payments Failure',
  props<{ error: HttpErrorResponse }>(),
);

/**
 * Create payment actions
 */
export const createPayment = createAction(
  '[Payments] Create Payment',
  props<{ payment: Omit<Payment, 'id'> }>(),
);

export const createPaymentSuccess = createAction(
  '[Payments] Create Payment Success',
  props<{ payment: Payment }>(),
);

export const createPaymentFailure = createAction(
  '[Payments] Create Payment Failure',
  props<{ error: HttpErrorResponse }>(),
);

/**
 * Update payment actions
 */
export const updatePayment = createAction(
  '[Payments] Update Payment',
  props<{ payment: Payment }>(),
);

export const updatePaymentSuccess = createAction(
  '[Payments] Update Payment Success',
  props<{ payment: Payment }>(),
);

export const updatePaymentFailure = createAction(
  '[Payments] Update Payment Failure',
  props<{ error: HttpErrorResponse }>(),
);

/**
 * Delete payment actions
 */
export const deletePayment = createAction(
  '[Payments] Delete Payment',
  props<{ id: string }>(),
);

export const deletePaymentSuccess = createAction(
  '[Payments] Delete Payment Success',
  props<{ id: string }>(),
);

export const deletePaymentFailure = createAction(
  '[Payments] Delete Payment Failure',
  props<{ error: HttpErrorResponse }>(),
);

/**
 * Get payments by group id
 */
export const getPaymentsByGroup = createAction(
  '[Payments] Get Payments By Group',
  props<{ groupId: string }>(),
);

export const getPaymentsByGroupSuccess = createAction(
  '[Payments] Get Payments By Group Success',
  props<{ payments: Payment[] }>(),
);

export const getPaymentsByGroupFailure = createAction(
  '[Payments] Get Payments By Group Failure',
  props<{ error: HttpErrorResponse }>(),
);
