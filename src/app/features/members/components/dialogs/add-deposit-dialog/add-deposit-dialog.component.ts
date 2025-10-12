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
  selector: 'app-add-deposit-dialog',
  templateUrl: './add-deposit-dialog.component.html',
  imports: [
    CustomDialogComponent,
    ReactiveFormsModule,
    TextInputComponent,
    DateInputComponent,
  ],
})
export class AddDepositDialogComponent {
  @Input() set visible(value: boolean) {
    this.dialogVisible.set(value);
  }
  @Output() close = new EventEmitter<void>();
  @Output() primaryClick = new EventEmitter<any>();

  dialogVisible = signal(false);
  depositForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.depositForm = this.fb.group({
      amount: [null, [Validators.required, Validators.min(0)]],
      depositDate: [new Date(), Validators.required],
      description: [''],
      paymentMethod: [''],
      referenceNumber: [''],
    });
  }

  onSubmit() {
    if (this.depositForm.valid) {
      this.primaryClick.emit(this.depositForm.value);
    }
  }

  onClose() {
    this.close.emit();
  }
}
