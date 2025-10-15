import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { RevenuesService } from '../../../services/revenues.service';
import { Revenue } from '../../../models/revenue.model';
import { DetailsFieldComponent } from '../../../../../shared/components/details-field/details-field.component';
import { DialogSectionComponent } from '../../../../../shared/components/dialog-section/dialog-section.component';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-delete-revenue-dialog',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    DetailsFieldComponent,
    DialogSectionComponent,
    CurrencyPipe,
    DatePipe,
  ],
  template: `
    <p-dialog
      header="Delete Revenue"
      [(visible)]="visible"
      [style]="{ width: '50vw' }"
      [modal]="true"
      (onHide)="onClose()"
    >
      <app-details-field
        [type]="'text'"
        label="Amount"
        [value]="revenue?.amount | currency"
      >
      </app-details-field>
      <app-details-field
        [type]="'text'"
        label="Date"
        [value]="revenue?.date | date"
      >
      </app-details-field>
      <app-details-field
        [type]="'text'"
        label="Description"
        [value]="revenue?.description"
      >
      </app-details-field>
      <app-details-field
        [type]="'text'"
        label="Category"
        [value]="revenue?.category"
      >
      </app-details-field>

      <div class="flex justify-end gap-2 mt-4">
        <button
          pButton
          label="Cancel"
          class="p-button-text"
          (click)="onClose()"
        ></button>
        <button
          pButton
          label="Delete"
          class="p-button-danger"
          [loading]="loading"
          (click)="onDelete()"
        ></button>
      </div>
    </p-dialog>
  `,
})
export class DeleteRevenueDialogComponent {
  @Input() visible = false;
  @Input() revenue: Revenue | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() deleted = new EventEmitter<void>();

  private revenuesService = inject(RevenuesService);
  loading = false;

  onClose() {
    this.visibleChange.emit(false);
  }

  onDelete() {
    if (!this.revenue) return;

    this.loading = true;
    this.revenuesService.delete(this.revenue.id).subscribe({
      next: () => {
        this.loading = false;
        this.deleted.emit();
        this.onClose();
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
