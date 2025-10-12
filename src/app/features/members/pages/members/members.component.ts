import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { MembersService } from '../../services/members.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  TableComponent,
  TableFilterBody,
} from '../../../../shared/components/table/table.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { CellTemplateDirective } from '../../../../shared/directives/cell-template.directive';
import { Member } from '../../models/member.model';
import { DialogConfirm } from '../../../../core/models/dialog-models';
import { DeleteMembersDialogComponent } from '../../components/dialogs/delete-members-dialog/delete-members-dialog.component';
import { AddMemberDialogComponent } from '../../components/dialogs/add-member-dialog/add-member-dialog.component';
type RowData = Member;
type PartialRowData = Partial<RowData>;

@Component({
  selector: 'app-members',
  imports: [
    TableComponent,
    CellTemplateDirective,
    ReactiveFormsModule,
    TagModule,
    DeleteMembersDialogComponent,
    AddMemberDialogComponent,
  ],
  templateUrl: './members.component.html',
  styleUrl: './members.component.scss',
})
export class Members implements OnInit {
  membersService = inject(MembersService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  @ViewChild(TableComponent) table!: TableComponent<RowData>;
  selectedRow = signal<RowData | null>(null);
  deleteDialogVisible = signal(false);
  addRowDialogVisible = signal(false);

  columns = [
    { field: 'code', header: 'Code' },
    { field: 'name', header: 'Name' },
    { field: 'balance', header: 'Balance' },
    { field: 'paidFee', header: 'Paid fee' },
    { field: 'leftToPay', header: 'Left to pay' },
    { field: 'subscription', header: 'Subscription' },
  ];
  get data() {
    return this.membersService.membersState().response!.data;
  }

  ngOnInit(): void {
    this.fetch();
  }
  fetch(filterBody?: TableFilterBody) {
    this.membersService
      .getAll(filterBody)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
  openDeleteDialog(data: RowData) {
    this.selectedRow.set(data);
    this.deleteDialogVisible.set(true);
  }
  colseDeleteDialog() {
    this.deleteDialogVisible.set(false);
  }
  openAddRowDialog() {
    this.addRowDialogVisible.set(true);
  }
  colseAddRowDialog() {
    this.addRowDialogVisible.set(false);
  }
  navigateToDetails(member: RowData) {
    this.router.navigate(['/members', member.id]);
  }
  handleConfirmDialog(dialogConfirm: DialogConfirm<PartialRowData>) {
    switch (dialogConfirm.mode) {
      case 'add':
        this.addRow(dialogConfirm.data);
        break;
    }
  }
  addRow(data: PartialRowData) {
    this.membersService
      .create(data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.membersService.membersState.update((state) => ({
            ...state,
            data: [response.data, ...state.response!.data],
          }));
        },
      });
  }

  deleteRow(row: PartialRowData) {
    this.membersService
      .delete(row.id!)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.membersService.membersState.update((state) => ({
            ...state,
            data: this.membersService
              .membersState()
              .response!.data.filter((member) => member.id !== row.id),
          }));
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
}
