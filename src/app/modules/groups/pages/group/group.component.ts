import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectGroupId } from '@app/core/stores/router/router.selectors';
import { take } from 'rxjs';
import { GroupsActions } from '@app/core/stores/groups';
import { Router } from '@angular/router';
@Component({
  selector: 'app-group',
  imports: [],
  templateUrl: './group.component.html',
  styleUrl: './group.component.scss',
})
export class GroupComponent implements OnInit {
  public groupId$ = this.store.select(selectGroupId);

  constructor(private store: Store, private router: Router) {}

  public ngOnInit(): void {
    this.groupId$.pipe(take(1)).subscribe((groupId) => {
      if (groupId) {
        this.store.dispatch(GroupsActions.loadGroup({ groupId }));
      } else {
        this.router.navigate(['/groups']);
      }
    });
  }
}
