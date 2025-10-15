import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { RevenuesService } from '../../services/revenues.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  TableComponent,
  TableFilterBody,
} from '../../../../shared/components/table/table.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { CellTemplateDirective } from '../../../../shared/directives/cell-template.directive';
import { Revenue } from '../../models/revenue.model';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { AddRevenueDialogComponent } from '../../components/dialogs/add-revenue-dialog/add-revenue-dialog.component';
import { DeleteRevenueDialogComponent } from '../../components/dialogs/delete-revenue-dialog/delete-revenue-dialog.component';

type RowData = Revenue;
type PartialRowData = Partial<RowData>;

@Component({
  selector: 'app-revenues',
  standalone: true,
  imports: [
    TableComponent,
    CellTemplateDirective,
    ReactiveFormsModule,
    TagModule,
    CurrencyPipe,
    DatePipe,
    AddRevenueDialogComponent,
    DeleteRevenueDialogComponent,
  ],
  template: `
    <header class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-semibold text-white">Revenues</h2>
      <img
        src="assets/icons/add.svg"
        alt="Add Revenue"
        title="Add Revenue"
        width="24"
        height="24"
        (click)="openAddRowDialog()"
        class="cursor-pointer"
      />
    </header>

    <app-table
      [columns]="columns"
      [data]="data"
      [totalRecords]="1000"
      (fetch)="fetch($event)"
    >
      <ng-template appCellTemplate="amount" let-data>
        {{ data.amount | currency }}
      </ng-template>

      <ng-template appCellTemplate="date" let-data>
        {{ data.date | date : 'mediumDate' }}
      </ng-template>

      <ng-template appCellTemplate="actions" let-data>
        <div class="flex gap-2">
          <button
            pButton
            icon="pi pi-pencil"
            class="p-button-rounded p-button-text"
            (click)="openEditRowDialog(data)"
          ></button>
          <button
            pButton
            icon="pi pi-trash"
            class="p-button-rounded p-button-text p-button-danger"
            (click)="openDeleteDialog(data)"
          ></button>
        </div>
      </ng-template>
    </app-table>

    <app-add-revenue-dialog
      [(visible)]="addRowDialogVisible"
      (saved)="fetch()"
    ></app-add-revenue-dialog>

    <app-delete-revenue-dialog
      [(visible)]="deleteDialogVisible"
      [revenue]="selectedRow()"
      (deleted)="fetch()"
    ></app-delete-revenue-dialog>
  `,
})
export class RevenuesComponent implements OnInit {
  revenuesService = inject(RevenuesService);
  private destroyRef = inject(DestroyRef);
  @ViewChild(TableComponent) table!: TableComponent<RowData>;
  selectedRow = signal<RowData | null>(null);
  deleteDialogVisible = signal(false);
  addRowDialogVisible = signal(false);

  columns = [
    { field: 'amount', header: 'Amount' },
    { field: 'date', header: 'Date' },
    { field: 'description', header: 'Description' },
    { field: 'category', header: 'Category' },
    { field: 'actions', header: 'Actions' },
  ];

  get data(): RowData[] {
    return this.revenuesService.revenuesState().response?.data ?? [];
  }

  ngOnInit(): void {
    this.fetch();
  }

  fetch(filterBody?: TableFilterBody) {
    this.revenuesService
      .getAll(filterBody)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  openDeleteDialog(data: RowData) {
    this.selectedRow.set(data);
    this.deleteDialogVisible.set(true);
  }

  closeDeleteDialog() {
    this.deleteDialogVisible.set(false);
  }

  openAddRowDialog() {
    this.selectedRow.set(null);
    this.addRowDialogVisible.set(true);
  }

  closeAddRowDialog() {
    this.addRowDialogVisible.set(false);
  }

  openEditRowDialog(data: RowData) {
    this.selectedRow.set(data);
    this.addRowDialogVisible.set(true);
  }
}
