import { Timestamp } from '@angular/fire/firestore';

export interface Group {
  id: string; // Unique identifier (typically set by Firestore)
  name: string; // Group name
  members: string[]; // List of user IDs in the group
  totalSpent: number; // Accumulated spending for the group
  adminOwners: string[]; // List of user IDs who are admin owners
  createdAt: Timestamp; // Firestore Timestamp for creation date
}
