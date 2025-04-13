import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  docData,
  collectionData,
  addDoc,
  updateDoc,
  Timestamp,
} from '@angular/fire/firestore';
import { Group } from '@app/core/models/interfaces';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GroupsService {
  private groupsCollection = collection(this.firestore, 'groups');

  constructor(private firestore: Firestore) {}

  getGroups(): Observable<Group[]> {
    return collectionData(this.groupsCollection) as Observable<Group[]>;
  }

  getGroupById(groupId: string): Observable<Group> {
    const groupDoc = doc(this.groupsCollection, groupId);
    return docData(groupDoc) as Observable<Group>;
  }

  createGroup(adminOwnerId: string): Observable<Group> {
    const newGroup: Group = {
      id: '', // This will be set by Firestore
      name: 'New Group',
      members: [adminOwnerId],
      totalSpent: 0,
      adminOwners: [adminOwnerId],
      createdAt: Timestamp.now(),
    };

    return from(addDoc(this.groupsCollection, newGroup)).pipe(
      switchMap((docRef) => {
        const groupWithId: Group = {
          ...newGroup,
          id: docRef.id,
        };

        return from(updateDoc(docRef, { id: docRef.id })).pipe(
          map(() => groupWithId),
        );
      }),
    );
  }
}
