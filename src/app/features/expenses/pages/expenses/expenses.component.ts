import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { ExpensesService } from '../../services/expenses.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  TableComponent,
  TableFilterBody,
} from '../../../../shared/components/table/table.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { CellTemplateDirective } from '../../../../shared/directives/cell-template.directive';
import { Expense } from '../../models/expense.model';
import { DeleteExpenseDialogComponent } from '../../components/dialogs/delete-expense-dialog/delete-expense-dialog.component';
import { AddExpenseDialogComponent } from '../../components/dialogs/add-expense-dialog/add-expense-dialog.component';
import { CurrencyPipe, DatePipe } from '@angular/common';

type RowData = Expense;
type PartialRowData = Partial<RowData>;

@Component({
  selector: 'app-expenses',
  imports: [
    TableComponent,
    CellTemplateDirective,
    ReactiveFormsModule,
    TagModule,
    DeleteExpenseDialogComponent,
    AddExpenseDialogComponent,
    CurrencyPipe,
    DatePipe,
  ],
  templateUrl: './expenses.component.html',
})
export class ExpensesComponent implements OnInit {
  expensesService = inject(ExpensesService);
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
  ];

  get data(): RowData[] {
    return (
      this.expensesService.expensesState().response?.data ?? [
        {
          amount: 0,
          date: new Date(),
          description: 'NA',
          category: 'water',
          id: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          amount: 10,
          date: new Date(),
          description: 'NA',
          category: 'water',
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]
    );
  }

  ngOnInit(): void {
    this.fetch();
  }

  fetch(filterBody?: TableFilterBody) {
    this.expensesService
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
    this.addRowDialogVisible.set(true);
  }

  closeAddRowDialog() {
    this.addRowDialogVisible.set(false);
  }

  addRow(data: PartialRowData) {
    this.expensesService
      .create(data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.expensesService.expensesState.update((state) => ({
            ...state,
            data: [response.data, ...state.response!.data],
          }));
        },
      });
  }

  deleteRow(row: RowData) {
    this.expensesService
      .delete(row.id!)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.expensesService.expensesState.update((state) => ({
            ...state,
            data: this.expensesService
              .expensesState()
              .response!.data.filter((expense) => expense.id !== row.id),
          }));
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
}
