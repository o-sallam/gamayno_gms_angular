import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MembersService } from '../../services/members.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  TableComponent,
  TableFilterBody,
} from '../../../../shared/components/table/table.component';

@Component({
  selector: 'app-members',
  imports: [TableComponent],
  templateUrl: './members.component.html',
  styleUrl: './members.component.scss',
})
export class Members implements OnInit {
  membersService = inject(MembersService);
  private destroyRef = inject(DestroyRef);

  columns = [
    { field: 'id', header: 'ID' },
    { field: 'code', header: 'Code' },
    { field: 'name', header: 'Name' },
    { field: 'balance', header: 'Balance' },
    { field: 'debt', header: 'Debt' },
    { field: 'credit', header: 'Credit' },
    { field: 'address', header: 'Address' },
    { field: 'phone', header: 'Phone' },
  ];
  ngOnInit(): void {
    // this.fetch();
  }
  fetch(filterBody?: TableFilterBody) {
    this.membersService
      .getAll(filterBody)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
