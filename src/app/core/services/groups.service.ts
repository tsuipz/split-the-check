import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  updateDoc,
  Timestamp,
  query,
  where,
  getDocs,
  DocumentReference,
  doc,
  getDoc,
} from '@angular/fire/firestore';
import { Group } from '@app/core/models/interfaces';
import { Observable, from, throwError } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GroupsService {
  private groupsCollection = collection(this.firestore, 'groups');

  constructor(private firestore: Firestore) {}

  getGroups(userId: string): Observable<Group[]> {
    const groupsQuery = query(
      this.groupsCollection,
      where('members', 'array-contains', userId),
    );

    return collectionData(groupsQuery).pipe(map((groups) => groups as Group[]));
  }

  public getGroupById(groupId: string, userId: string): Observable<Group> {
    const groupQuery = query(
      this.groupsCollection,
      where('id', '==', groupId),
      where('members', 'array-contains', userId),
    );

    return from(getDocs(groupQuery)).pipe(
      map((memberSnapshot) => {
        const doc = memberSnapshot.docs[0];

        if (!doc) {
          throw new Error('Group not found or user is not authorized');
        }

        return doc.data() as Group;
      }),
      catchError(() =>
        throwError(
          () => new Error('Group not found or user is not authorized'),
        ),
      ),
    );
  }

  public createGroup(adminOwnerId: string): Observable<Group> {
    const newGroup: Group = {
      id: '', // This will be set by Firestore
      name: 'New Group',
      members: [adminOwnerId],
      totalSpent: 0,
      adminOwners: [adminOwnerId],
      createdAt: Timestamp.now(),
    };

    return from(addDoc(this.groupsCollection, newGroup)).pipe(
      switchMap((docRef: DocumentReference) => {
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

  public addMembersToGroup(
    groupId: string,
    userIds: string[],
  ): Observable<Group> {
    const groupDoc = doc(this.groupsCollection, groupId);

    return from(getDoc(groupDoc)).pipe(
      map((doc) => doc.data() as Group),
      switchMap((group) => {
        const existingSet = new Set(group.members);

        for (const userId of userIds) {
          existingSet.add(userId);
        }

        const updatedGroup: Group = {
          ...group,
          members: Array.from(existingSet),
        };

        return from(
          updateDoc(groupDoc, { members: updatedGroup.members }),
        ).pipe(
          map(() => {
            return updatedGroup;
          }),
        );
      }),
    );
  }

  public updateGroupName(groupId: string, name: string): Observable<Group> {
    const groupDoc = doc(this.groupsCollection, groupId);

    return from(getDoc(groupDoc)).pipe(
      map((doc) => doc.data() as Group),
      switchMap((group) => {
        const updatedGroup: Group = {
          ...group,
          name,
        };

        return from(updateDoc(groupDoc, { name })).pipe(
          map(() => updatedGroup),
        );
      }),
    );
  }
}
