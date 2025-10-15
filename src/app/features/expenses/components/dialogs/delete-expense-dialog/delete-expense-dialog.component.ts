import { Component, EventEmitter, input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { Expense } from '../../../models/expense.model';
import { CustomDialogComponent } from '../../../../../core/components/dialog.component';

@Component({
  selector: 'app-delete-expense-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, CustomDialogComponent],
  template: `
    <app-dialog
      [title]="'Delete Expense'"
      [visible]="visible()"
      (primaryClick)="onConfirm()"
      (close)="onHide()"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"></i>
        @if (expense()) {
        <span>
          Are you sure you want to delete the expense
          <b>{{ expense()?.description }}</b
          >?
        </span>
        }
      </div>
    </app-dialog>
  `,
  styles: [
    `
      .confirmation-content {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        margin: 1rem 0;
      }
    `,
  ],
})
export class DeleteExpenseDialogComponent {
  visible = input<boolean>(false);
  expense = input<Expense | null>();

  @Output() close = new EventEmitter<boolean>();
  @Output() primaryClick = new EventEmitter<Expense>();

  onHide() {
    this.close.emit(false);
  }

  onConfirm() {
    this.primaryClick.emit(this.expense()!);
    this.onHide();
  }
}
