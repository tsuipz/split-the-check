import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from '@angular/fire/firestore';
import { User } from '@app/core/models/interfaces';
import { Observable, from, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private usersCollection = collection(this.firestore, 'users');

  constructor(private firestore: Firestore) {}

  searchUsers(searchTerm: string): Observable<User[]> {
    if (!searchTerm.trim()) {
      return from([]);
    }

    const searchTermLower = searchTerm.toLowerCase();

    // Create a single query that searches both name and email
    const usersQuery = query(
      this.usersCollection,
      where('name', '>=', searchTermLower),
      where('name', '<=', searchTermLower + '\uf8ff'),
      orderBy('name'),
      limit(10),
    );

    const emailQuery = query(
      this.usersCollection,
      where('email', '>=', searchTermLower),
      where('email', '<=', searchTermLower + '\uf8ff'),
      orderBy('email'),
      limit(10),
    );

    // Execute both queries and combine results using forkJoin
    return forkJoin([
      from(getDocs(usersQuery)),
      from(getDocs(emailQuery)),
    ]).pipe(
      map(([nameSnapshot, emailSnapshot]) => {
        // Combine results and remove duplicates
        const usersMap = new Map<string, User>();

        [...nameSnapshot.docs, ...emailSnapshot.docs].forEach((doc) => {
          const data = doc.data() as User;
          usersMap.set(doc.id, data);
        });

        return Array.from(usersMap.values());
      }),
    );
  }
}
