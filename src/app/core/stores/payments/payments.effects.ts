import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, from } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as PaymentsActions from './payments.actions';
import { PaymentsService } from '@app/core/services/payments.service';
import { Payment } from '@app/core/models/interfaces';
@Injectable()
export class PaymentsEffects {
  constructor(
    private actions$: Actions,
    private paymentsService: PaymentsService,
  ) {}

  loadPayments$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaymentsActions.loadPayments),
      mergeMap(() => {
        return this.paymentsService.getPayments().pipe(
          map((payments: Payment[]) =>
            PaymentsActions.loadPaymentsSuccess({ payments }),
          ),
          catchError((error) =>
            of(PaymentsActions.loadPaymentsFailure({ error })),
          ),
        );
      }),
    );
  });

  /**
   * Create payment effect
   */
  public createPayment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaymentsActions.createPayment),
      mergeMap(({ payment }) => {
        return from(this.paymentsService.createPayment(payment)).pipe(
          map((createdPayment: Payment) =>
            PaymentsActions.createPaymentSuccess({ payment: createdPayment }),
          ),
          catchError((error) =>
            of(PaymentsActions.createPaymentFailure({ error })),
          ),
        );
      }),
    );
  });

  updatePayment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaymentsActions.updatePayment),
      mergeMap(({ payment }) => {
        return from(this.paymentsService.updatePayment(payment)).pipe(
          map(() => PaymentsActions.updatePaymentSuccess({ payment })),
          catchError((error) =>
            of(PaymentsActions.updatePaymentFailure({ error })),
          ),
        );
      }),
    );
  });

  deletePayment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaymentsActions.deletePayment),
      mergeMap(({ id }) => {
        return from(this.paymentsService.deletePayment(id)).pipe(
          map(() => PaymentsActions.deletePaymentSuccess({ id })),
          catchError((error) =>
            of(PaymentsActions.deletePaymentFailure({ error })),
          ),
        );
      }),
    );
  });

  /**
   * Get payments by group effect
   */
  public getPaymentsByGroup$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaymentsActions.getPaymentsByGroup),
      mergeMap(({ groupId }) => {
        return this.paymentsService.getPaymentsByGroup(groupId).pipe(
          map((payments) =>
            PaymentsActions.getPaymentsByGroupSuccess({ payments }),
          ),
          catchError((error) =>
            of(PaymentsActions.getPaymentsByGroupFailure({ error })),
          ),
        );
      }),
    );
  });
}
