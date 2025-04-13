export interface Group {
  id: string; // Unique identifier for the group (Firestore document ID)
  name: string; // Name of the group
  members: string[]; // Array of user IDs who are members of the group
  totalSpent: number; // Total amount spent by the group
  adminOwners: string[]; // Array of user IDs who are designated as admin owners
}
