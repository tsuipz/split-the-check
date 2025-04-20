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
import { Observable } from 'rxjs';
import { Payment } from '@app/core/models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class PaymentsService {
  private readonly collectionName = 'payments';

  constructor(private firestore: Firestore) {}

  getPayments(): Observable<Payment[]> {
    const paymentsRef = collection(this.firestore, this.collectionName);
    return collectionData(paymentsRef, { idField: 'id' }) as Observable<
      Payment[]
    >;
  }

  getPayment(id: string): Observable<Payment> {
    const paymentRef = doc(this.firestore, this.collectionName, id);
    return docData(paymentRef, { idField: 'id' }) as Observable<Payment>;
  }

  createPayment(payment: Omit<Payment, 'id'>): Promise<Payment> {
    const paymentsRef = collection(this.firestore, this.collectionName);
    return addDoc(paymentsRef, {
      ...payment,
      date: payment.date.toISOString(), // Convert Date to string for Firestore
    }).then((docRef) => {
      return {
        ...payment,
        id: docRef.id,
      } as Payment;
    });
  }

  updatePayment(payment: Payment): Promise<void> {
    const paymentRef = doc(this.firestore, this.collectionName, payment.id);
    return updateDoc(paymentRef, {
      ...payment,
      date: payment.date.toISOString(), // Convert Date to string for Firestore
    });
  }

  deletePayment(id: string): Promise<void> {
    const paymentRef = doc(this.firestore, this.collectionName, id);
    return deleteDoc(paymentRef);
  }

  getPaymentsByGroup(groupId: string): Observable<Payment[]> {
    const paymentsRef = collection(this.firestore, this.collectionName);
    const q = query(paymentsRef, where('groupId', '==', groupId));
    return collectionData(q, { idField: 'id' }) as Observable<Payment[]>;
  }
}
