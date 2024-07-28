import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/friends/friends.component').then(
        (m) => m.FriendsComponent,
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/friend/friend.component').then((m) => m.FriendComponent),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FriendsRoutingModule {}
