import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { MembersService } from '../../services/members.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  TableComponent,
  TableFilterBody,
} from '../../../../shared/components/table/table.component';
import { Button } from '../../../../shared/components/button/button.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { CellTemplateDirective } from '../../../../shared/directives/cell-template.directive';
import { Member } from '../../models/member.model';
import {
  DialogConfig,
  DialogConfirm,
} from '../../../../core/models/dialog-models';
import { MembersCrudDialogComponent } from '../members-crud-dialog/members-crud-dialog.component';
type RowData = Member;
type PartialRowData = Partial<RowData>;

@Component({
  selector: 'app-members',
  imports: [
    TableComponent,
    CellTemplateDirective,
    Button,
    ReactiveFormsModule,
    TagModule,
    MembersCrudDialogComponent,
  ],
  templateUrl: './members.component.html',
  styleUrl: './members.component.scss',
})
export class Members implements OnInit {
  membersService = inject(MembersService);
  private destroyRef = inject(DestroyRef);
  @ViewChild(TableComponent) table!: TableComponent<RowData>;
  dialogConfig = signal<DialogConfig<RowData>>(null);
  //TODO: open row details dialog
  columns = [
    // { field: 'id', header: 'ID' },
    { field: 'code', header: 'Code' },
    { field: 'name', header: 'Name' },
    { field: 'balance', header: 'Balance' },
    { field: 'paidFee', header: 'Paid fee' },
    { field: 'leftToPay', header: 'Left to pay' },
    // { field: 'address', header: 'Address' },
    // { field: 'phone', header: 'Phone' },
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
  openDialog(mode: 'add' | 'update' | 'delete' | 'details', rowData?: RowData) {
    const title =
      mode === 'add'
        ? 'Add Member'
        : mode === 'update'
        ? 'Update Member'
        : mode === 'delete'
        ? 'Delete Member'
        : 'Member Details';
    this.dialogConfig.set({ title, mode, row: rowData });
  }
  handleConfirmDialog(dialogConfirm: DialogConfirm<PartialRowData>) {
    switch (dialogConfirm.mode) {
      case 'add':
        this.addRow(dialogConfirm.data);
        break;
      case 'update':
        this.updateRow(dialogConfirm.data);
        break;
      case 'delete':
        this.deleteRow(dialogConfirm.data);
        break;
      case 'details':
        // Details mode doesn't need any action, just close dialog
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
  updateRow(row: PartialRowData) {
    this.membersService
      .update(row.id!, row)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.membersService.membersState.update((state) => ({
            ...state,
            data: this.membersService
              .membersState()
              .response!.data.map((member) =>
                member.id === row.id ? response.data : member
              ),
          }));
        },
      });
  }
}
