import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CustomDialogComponent } from '../../../../../core/components/dialog.component';
import { TextInputComponent } from '../../../../../shared/components/text-input/text-input.component';
import { DetailsFieldComponent } from '../../../../../shared/components/details-field/details-field.component';
import { DateInputComponent } from '../../../../../shared/components/date-input/date-input.component';

@Component({
  selector: 'app-renew-subscription-dialog',
  templateUrl: './renew-subscription-dialog.component.html',
  imports: [
    CustomDialogComponent,
    ReactiveFormsModule,
    TextInputComponent,
    DetailsFieldComponent,
    DateInputComponent,
  ],
})
export class RenewSubscriptionDialogComponent {
  @Input() set visible(value: boolean) {
    this.dialogVisible.set(value);
  }
  @Output() close = new EventEmitter<void>();
  @Output() primaryClick = new EventEmitter<any>();

  dialogVisible = signal(false);
  renewForm: FormGroup;
  totalSubscriptionFee = signal(0);
  leftToPay = signal(0);

  constructor(private fb: FormBuilder) {
    this.renewForm = this.fb.group({
      subscriptionFee: [0, [Validators.required, Validators.min(0)]],
      monthCount: [
        1,
        [Validators.required, Validators.min(1), Validators.max(12)],
      ],
      startDate: [null, Validators.required],
      endDate: [{ value: null, disabled: true }],
      paidFee: [0, [Validators.required, Validators.min(0)]],
    });
  }

  setTotalSubscriptionFee() {
    const fee = this.renewForm.get('subscriptionFee')?.value || 0;
    const months = this.renewForm.get('monthCount')?.value || 1;
    this.totalSubscriptionFee.set(fee * months);
    this.setPaidFee();
  }

  setSubscriptionData() {
    this.setTotalSubscriptionFee();
    this.setSubscriptionEndDate();
  }

  setSubscriptionEndDate(event?: any) {
    const startDate = event || this.renewForm.get('startDate')?.value;
    const monthCount = this.renewForm.get('monthCount')?.value || 1;

    if (startDate) {
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + monthCount);
      this.renewForm.patchValue({ endDate });
    }
  }

  setPaidFee() {
    const paidFee = this.renewForm.get('paidFee')?.value || 0;
    const total = this.totalSubscriptionFee();
    this.leftToPay.set(total - paidFee);
  }

  onSubmit() {
    if (this.renewForm.valid) {
      this.primaryClick.emit(this.renewForm.value);
    } else {
      this.renewForm.markAllAsTouched();
    }
  }

  onClose() {
    this.close.emit();
  }
}
