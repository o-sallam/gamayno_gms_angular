import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
  input,
} from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RevenuesService } from '../../../services/revenues.service';
import { Revenue } from '../../../models/revenue.model';
import { DetailsFieldComponent } from '../../../../../shared/components/details-field/details-field.component';
import { DateInputComponent } from '../../../../../shared/components/date-input/date-input.component';
import { TextInputComponent } from '../../../../../shared/components/text-input/text-input.component';
import { DialogSectionComponent } from '../../../../../shared/components/dialog-section/dialog-section.component';
import { CustomDialogComponent } from '../../../../../core/components/dialog.component';
import { SelectInputComponent } from '../../../../../shared/components/select-input/select-input.component';

@Component({
  selector: 'app-add-revenue-dialog',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    ReactiveFormsModule,
    DateInputComponent,
    TextInputComponent,
    CustomDialogComponent,
    SelectInputComponent,
  ],
  template: `
    <app-dialog
      [title]="'Add Revenue'"
      [visible]="visible()"
      (visibleChange)="onClose()"
      [hasButtons]="true"
      (primaryClick)="onSubmit()"
      (close)="onClose()"
    >
      <form [formGroup]="form" class="flex flex-col gap-3">
        <app-select-input
          [label]="'Category'"
          formControlName="category"
          [options]="categories"
        ></app-select-input>
        <app-text-input
          formControlName="amount"
          label="Amount"
          type="number"
        ></app-text-input>

        <app-date-input formControlName="date" label="Date"></app-date-input>

        <app-text-input
          formControlName="description"
          label="Description"
        ></app-text-input>
      </form>
    </app-dialog>
  `,
})
export class AddRevenueDialogComponent implements OnInit {
  visible = input<boolean>(false);
  @Input() selectedRevenue: Revenue | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() saved = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private revenuesService = inject(RevenuesService);
  categories = [
    { label: 'Membership Fees', value: 'membership_fees' },
    { label: 'Personal Training Sessions', value: 'personal_training' },
    { label: 'Class Fees', value: 'class_fees' },
    { label: 'Day Passes', value: 'day_passes' },
    { label: 'Supplements & Merchandise', value: 'supplements_merchandise' },
    { label: 'Equipment Rental', value: 'equipment_rental' },
    { label: 'Nutrition or Fitness Plans', value: 'nutrition_plans' },
    { label: 'Event or Competition Fees', value: 'event_fees' },
  ];

  form!: FormGroup;
  loading = false;

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.form = this.fb.group({
      category: [this.selectedRevenue?.category ?? '', [Validators.required]],
      amount: [this.selectedRevenue?.amount ?? '', [Validators.required]],
      date: [this.selectedRevenue?.date ?? new Date(), [Validators.required]],
      description: [
        this.selectedRevenue?.description ?? '',
        [Validators.required],
      ],
    });
  }

  onClose() {
    this.visibleChange.emit(false);
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;
    const formValue = this.form.value;

    const request$ = this.revenuesService.create(formValue);

    request$.subscribe({
      next: () => {
        this.loading = false;
        this.saved.emit();
        this.onClose();
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
