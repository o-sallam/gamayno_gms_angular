import { Component, inject, OnInit } from '@angular/core';
import { MembersService } from '../../services/members.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TableComponent } from '../../../../shared/components/table/table';

@Component({
  selector: 'app-members',
  imports: [TableComponent],
  templateUrl: './members.html',
  styleUrl: './members.scss',
})
export class Members implements OnInit {
  membersService = inject(MembersService);
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
    // this.membersService.getAll().pipe(takeUntilDestroyed()).subscribe();
  }
}
