import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from '@angular/fire/firestore';
import { from, map, Observable, switchMap } from 'rxjs';
import { Payment } from '@app/core/models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class PaymentsService {
  private readonly collectionName = 'payments';
  private readonly paymentsCollection = collection(
    this.firestore,
    this.collectionName,
  );

  constructor(private firestore: Firestore) {}

  getPayments(): Observable<Payment[]> {
    return collectionData(this.paymentsCollection, {
      idField: 'id',
    }) as Observable<Payment[]>;
  }

  getPayment(id: string): Observable<Payment> {
    const paymentRef = doc(this.firestore, this.collectionName, id);
    return docData(paymentRef, { idField: 'id' }) as Observable<Payment>;
  }

  /**
   * Create payment
   * @param payment - Payment to create
   * @returns Payment
   */
  public createPayment(payment: Omit<Payment, 'id'>): Observable<Payment> {
    return from(addDoc(this.paymentsCollection, payment)).pipe(
      switchMap((docRef) => {
        const paymentWithId: Payment = {
          ...payment,
          id: docRef.id,
        };

        // Update the payment with the id
        return from(updateDoc(docRef, { id: docRef.id })).pipe(
          map(() => paymentWithId),
        );
      }),
    );
  }

  updatePayment(payment: Payment): Promise<void> {
    const paymentRef = doc(this.firestore, this.collectionName, payment.id);
    return updateDoc(paymentRef, {
      ...payment,
      date: payment.date.toDate().toISOString(), // Convert Date to string for Firestore
    });
  }

  deletePayment(id: string): Promise<void> {
    const paymentRef = doc(this.firestore, this.collectionName, id);
    return deleteDoc(paymentRef);
  }

  /**
   * Get payments by group
   * @param groupId - Group id
   * @returns Payments
   */
  public getPaymentsByGroup(groupId: string): Observable<Payment[]> {
    const q = query(this.paymentsCollection, where('groupId', '==', groupId));
    return collectionData(q, { idField: 'id' }).pipe(
      map((payments) => payments as Payment[]),
    );
  }
}
