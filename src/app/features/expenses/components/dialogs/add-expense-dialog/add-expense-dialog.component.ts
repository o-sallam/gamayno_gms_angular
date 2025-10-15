import { Component, EventEmitter, input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { PartialExpense } from '../../../models/expense.model';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomDialogComponent } from '../../../../../core/components/dialog.component';
import { TextInputComponent } from '../../../../../shared/components/text-input/text-input.component';
import { SelectInputComponent } from '../../../../../shared/components/select-input/select-input.component';
import { DateInputComponent } from "../../../../../shared/components/date-input/date-input.component";

@Component({
  selector: 'app-add-expense-dialog',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    ReactiveFormsModule,
    SelectModule,
    InputNumberModule,
    FormsModule,
    CustomDialogComponent,
    TextInputComponent,
    SelectInputComponent,
    DateInputComponent
],
  templateUrl: './add-expense-dialog.component.html',
})
export class AddExpenseDialogComponent {
  visible = input<boolean>(false);
  @Output() close = new EventEmitter<boolean>();
  @Output() primaryClick = new EventEmitter<PartialExpense>();

  form: FormGroup;
  categories = [
    { label: 'Rent & Utilities', value: 'rent_utilities' },
    { label: 'Equipment Purchase', value: 'equipment_purchase' },
    { label: 'Equipment Maintenance', value: 'equipment_maintenance' },
    { label: 'Staff Salaries', value: 'staff_salaries' },
    { label: 'Cleaning & Maintenance', value: 'cleaning_maintenance' },
    { label: 'Water', value: 'water' },
    { label: 'Software & Subscriptions', value: 'software' },
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      category: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      date: [new Date(), Validators.required],
      description: [null],
    });
  }

  onClose() {
    this.close.emit(false);
    this.form.reset();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.primaryClick.emit(this.form.value);
    this.onClose();
  }
}
