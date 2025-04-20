import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/groups/groups.component').then((m) => m.GroupsComponent),
  },
  {
    path: ':groupId',
    loadComponent: () =>
      import('./pages/group/group.component').then((m) => m.GroupComponent),
  },
  {
    path: ':groupId/payment',
    loadComponent: () =>
      import('../../shared/components/payment/payment.component').then(
        (m) => m.PaymentComponent,
      ),
  },
  {
    path: ':groupId/pay-back',
    loadComponent: () =>
      import('./pages/pay-back/pay-back.component').then(
        (m) => m.PayBackComponent,
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupsRoutingModule {}
