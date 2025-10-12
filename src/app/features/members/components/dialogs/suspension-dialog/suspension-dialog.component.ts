import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CustomDialogComponent } from '../../../../../core/components/dialog.component';
import { DateInputComponent } from '../../../../../shared/components/date-input/date-input.component';
import { TextInputComponent } from '../../../../../shared/components/text-input/text-input.component';

@Component({
  selector: 'app-suspension-dialog',
  templateUrl: './suspension-dialog.component.html',
  imports: [
    CustomDialogComponent,
    ReactiveFormsModule,
    TextInputComponent,
    DateInputComponent,
  ],
})
export class SuspensionDialogComponent {
  @Input() set visible(value: boolean) {
    this.dialogVisible.set(value);
  }
  @Input() set memberSuspensionCount(value: number) {
    this.suspensionCount.set(value);
  }

  @Output() close = new EventEmitter<void>();
  @Output() primaryClick = new EventEmitter<any>();

  dialogVisible = signal(false);
  suspensionCount = signal(0);
  suspensionEndDate = signal<Date | null>(null);
  suspensionForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.suspensionForm = this.fb.group({
      startDate: [new Date(), Validators.required],
      daysOfSuspension: [0, [Validators.required, Validators.min(0)]],
    });
  }

  setSuspensionEndDate(event?: any) {
    const startDate = event || this.suspensionForm.get('startDate')?.value;
    const days = this.suspensionForm.get('daysOfSuspension')?.value || 0;

    if (startDate && days > 0) {
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + days);
      this.suspensionEndDate.set(endDate);
    } else {
      this.suspensionEndDate.set(null);
    }
  }

  onSubmit() {
    if (this.suspensionForm.valid) {
      this.primaryClick.emit({
        ...this.suspensionForm.value,
        endDate: this.suspensionEndDate(),
      });
    }
  }

  onClose() {
    this.close.emit();
  }
}
