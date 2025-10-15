import { Component, computed, input, output, signal } from '@angular/core';
import {
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BaseForm } from '../../../../../core/config/base-form';

import { CustomDialogComponent } from '../../../../../core/components/dialog.component';
import { TagModule } from 'primeng/tag';
import { TextInputComponent } from '../../../../../shared/components/text-input/text-input.component';
import { DetailsFieldComponent } from '../../../../../shared/components/details-field/details-field.component';
import { DateInputComponent } from '../../../../../shared/components/date-input/date-input.component';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { DialogSectionComponent } from '../../../../../shared/components/dialog-section/dialog-section.component';

@Component({
  selector: 'app-add-member-dialog',
  imports: [
    CustomDialogComponent,
    ReactiveFormsModule,
    TextInputComponent,
    TagModule,
    DetailsFieldComponent,
    ToggleSwitchModule,
    DateInputComponent,
    FormsModule,
    DialogSectionComponent,
  ],
  templateUrl: './add-member-dialog.component.html',
})
export class AddMemberDialogComponent extends BaseForm {
  dialogVisible = input(false);
  primaryClick = output<any>();
  close = output<void>();

  totalSubscriptionFee = signal<number | null>(null);
  paidFee = signal<number | null>(null);

  leftToPay = computed(() => {
    const total = this.totalSubscriptionFee() ?? 0;
    const paid = this.paidFee() ?? 0;
    return total - paid;
  });
  constructor() {
    super();
  }

  protected buildForm(): FormGroup {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 30); // add 30 days
    return this.fb.group({
      name: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(5)],
      ],
      subscriptionFee: [null, [Validators.required, Validators.min(0)]],
      subscriptionmonthCount: [1, [Validators.required, Validators.min(1)]],
      subscriptionStartDate: [startDate, [Validators.required]],
      subscriptionEndDate: [endDate, [Validators.required]],
      paidFee: [0, []],
      phone: ['', [Validators.minLength(11), Validators.maxLength(11)]],
      address: ['', []],
    });
  }

  resetLocalVariables() {
    this.totalSubscriptionFee.set(null);
    this.paidFee.set(null);
  }

  closeDialog() {
    this.resetLocalVariables();
    this.close.emit();
  }

  confirmDialog() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.primaryClick.emit(this.form.value);
  }

  setSubscriptionData() {
    this.setSubscriptionEndDate();
    this.setTotalSubscriptionFee();
  }
  setSubscriptionEndDate(date?: Date | null) {
    const subscriptionStartDate = date ?? this.form.value.subscriptionStartDate;
    const subscriptionmonthCount = this.form.value.subscriptionmonthCount;

    if (
      subscriptionStartDate != null &&
      subscriptionmonthCount != null &&
      subscriptionmonthCount != ''
    ) {
      const futureDate = new Date(
        subscriptionStartDate.getTime() +
          subscriptionmonthCount * 30 * 24 * 60 * 60 * 1000
      );
      this.form.patchValue({ subscriptionEndDate: futureDate });
    }
  }
  setTotalSubscriptionFee() {
    const subscriptionFee = this.form.value.subscriptionFee;
    const subscriptionmonthCount = this.form.value.subscriptionmonthCount;

    if (
      subscriptionFee != null &&
      subscriptionFee != '' &&
      subscriptionmonthCount != null &&
      subscriptionmonthCount != ''
    ) {
      this.totalSubscriptionFee.set(subscriptionFee * subscriptionmonthCount);
    }
  }
  setPaidFee() {
    const paidFee = this.form.value.paidFee;
    this.paidFee.set(paidFee);
  }
}
