import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { TransactionsService } from '../../services/transactions.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  TableComponent,
  TableFilterBody,
} from '../../../../shared/components/table/table.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { CellTemplateDirective } from '../../../../shared/directives/cell-template.directive';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Transaction } from '../../models/transaction.model';

type RowData = Transaction;

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    TableComponent,
    CellTemplateDirective,
    ReactiveFormsModule,
    TagModule,
    CurrencyPipe,
    DatePipe,
  ],
  template: `
    <header class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-semibold text-white">Transactions</h2>
      <!-- <img
        src="assets/icons/add.svg"
        alt="Add Revenue"
        title="Add Revenue"
        width="24"
        height="24"
        (click)="openAddRowDialog()"
        class="cursor-pointer"
      /> -->
    </header>

    <app-table
      [columns]="columns"
      [data]="data"
      [totalRecords]="1000"
      (fetch)="fetch($event)"
    >
      <ng-template cellTemplate="date" let-value>
        <td>
          {{ value | date }}
        </td>
      </ng-template>
      <ng-template cellTemplate="amount" let-value>
        <td>
          {{ value | currency }}
        </td>
      </ng-template>
      <ng-template cellTemplate="type" let-value>
        <td>
          <p-tag
            [value]="value"
            [severity]="
              value === 'revenue'
                ? 'success'
                : value === 'expense'
                ? 'danger'
                : 'warn'
            "
          ></p-tag>
        </td>
      </ng-template>
    </app-table>
  `,
})
export class TransactionsComponent implements OnInit {
  transactionsService = inject(TransactionsService);
  private destroyRef = inject(DestroyRef);
  @ViewChild(TableComponent) table!: TableComponent<RowData>;
  selectedRow = signal<RowData | null>(null);
  deleteDialogVisible = signal(false);
  addRowDialogVisible = signal(false);

  columns = [
    { field: 'date', header: 'Date' },
    { field: 'amount', header: 'Amount' },
    { field: 'type', header: 'Type' },
    { field: 'category', header: 'Category' },
    { field: 'description', header: 'Description' },
    // { field: 'actions', header: 'Actions' },
  ];

  get data(): RowData[] {
    return this.transactionsService.transactionsState().response?.data ?? [];
  }

  ngOnInit(): void {
    this.fetch();
  }

  fetch(filterBody?: TableFilterBody) {
    this.transactionsService
      .getAll(filterBody)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: (error) => {
          this.transactionsService.transactionsState.set({
            ...this.transactionsService.transactionsState(),
            response: {
              data: [
                {
                  id: 1,
                  amount: 350,
                  date: new Date(),
                  type: 'revenue',
                  category: 'Subscription',
                  description: 'Monthly Subscription',
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
                {
                  id: 2,
                  amount: 100,
                  date: new Date(),
                  type: 'expense',
                  category: 'Water',
                  description: 'Water bill',
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
                {
                  id: 3,
                  amount: 200,
                  date: new Date(),
                  type: 'withdrawal',
                  category: null,
                  description: null,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              ],
            },
          });
        },
      });
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
