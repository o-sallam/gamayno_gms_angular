import {
  Component,
  computed,
  model,
  OnChanges,
  output,
  signal,
  SimpleChanges,
} from '@angular/core';
import {
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BaseForm } from '../../../../core/config/base-form';
import {
  DialogConfig,
  DialogConfirm,
} from '../../../../core/models/dialog-models';
import { Member } from '../../models/member.model';
import { CustomDialogComponent } from '../../../../core/components/dialog.component';
import { TagModule } from 'primeng/tag';
import { TextInputComponent } from '../../../../shared/components/text-input/text-input.component';
import { DetailsFieldComponent } from '../../../../shared/components/details-field/details-field.component';
import { DateInputComponent } from '../../../../shared/components/date-input/date-input.component';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { DialogSectionComponent } from '../../../../shared/components/dialog-section/dialog-section.component';

type RowData = Member;

@Component({
  selector: 'app-add-update-delete-members-dialog',
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
  templateUrl: './members-crud-dialog.component.html',
  styleUrl: './members-crud-dialog.component.scss',
})
export class MembersCrudDialogComponent extends BaseForm implements OnChanges {
  dialogConfig = model<DialogConfig<RowData>>(null);
  dialogVisible = model(false);
  confirmDialogChange = output<DialogConfirm<RowData>>();
  subscriptionStatus = model<'active' | 'inactive'>('inactive');
  checked = model<boolean>(false);

  // local variables
  hasButtons = computed(() => {
    const config = this.dialogConfig();
    return config !== null && config.mode !== 'details';
  });

  suspensionEndDate = signal<Date | null>(null);
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
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dialogConfig'] && this.dialogConfig()) {
      this.openDialog();
    }
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
      suspensionStartDate: [null, []],
      daysOfSuspension: [null, [Validators.min(1), Validators.max(60)]],
      suspensionCount: [0, []],
      phone: ['', [Validators.minLength(11), Validators.maxLength(11)]],
      address: ['', []],
    });
  }
  openDialog() {
    this.dialogVisible.set(true);

    if (this.dialogConfig()?.mode === 'update' && this.dialogConfig()?.row) {
      this.form.reset();
      this.resetLocalVariables();

      this.form.patchValue(this.dialogConfig()?.row!); // prefill form for update
      this.setSubscriptionStatusFromDialog();
    } else if (this.dialogConfig()?.mode === 'add') {
      this.form = this.buildForm();
      this.resetLocalVariables();
    }
  }
  resetLocalVariables() {
    this.suspensionEndDate.set(null);
    this.totalSubscriptionFee.set(null);
    this.paidFee.set(null);
  }

  setSubscriptionStatusFromDialog() {
    const current =
      (this.dialogConfig()?.row?.subscription as any) ?? 'inactive';
    this.subscriptionStatus.set(current as 'active' | 'inactive');
    this.checked.set(this.subscriptionStatus() === 'active');
  }

  closeDialog() {
    this.dialogVisible.set(false);
    this.dialogConfig.set(null);
  }

  confirmDialog() {
    const config = this.dialogConfig();
    if (!config) return;

    // For details mode, just close the dialog without emitting any data
    if (config.mode === 'details') {
      this.closeDialog();
      return;
    }

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }
    if (!this.checkForSuspensionValidation()) return;
    this.confirmDialogChange.emit({
      mode: config.mode,
      data: { ...this.form.value, subscription: this.subscriptionStatus() },
    });

    this.closeDialog();
  }

  onToggleChange(checked: boolean) {
    this.checked.set(checked);
    this.subscriptionStatus.set(checked ? 'active' : 'inactive');
    this.form.patchValue({ subscription: this.subscriptionStatus() });
  }
  setSuspensionEndDate(date?: Date | null) {
    const suspensionStartDate = date ?? this.form.value.suspensionStartDate;
    const daysOfSuspension = this.form.value.daysOfSuspension;
    if (
      this.form.controls['daysOfSuspension'].errors ||
      daysOfSuspension == '' ||
      daysOfSuspension == null
    ) {
      this.suspensionEndDate.set(null);
      return;
    }

    if (suspensionStartDate != null) {
      const futureDate = new Date(
        suspensionStartDate.getTime() + daysOfSuspension * 24 * 60 * 60 * 1000
      );

      this.suspensionEndDate.set(futureDate);
    }
  }
  checkForSuspensionValidation() {
    const suspensionStartDate = this.form.value.suspensionStartDate;
    const daysOfSuspension = this.form.value.daysOfSuspension;
    if (
      suspensionStartDate != null &&
      daysOfSuspension != null &&
      daysOfSuspension != ''
    ) {
      return true;
    }

    if (suspensionStartDate == null && daysOfSuspension == null) {
      return true;
    }

    return false;
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
