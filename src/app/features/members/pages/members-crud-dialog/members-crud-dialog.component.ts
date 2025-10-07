import {
  Component,
  computed,
  model,
  OnChanges,
  output,
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
import { DecimalPipe } from '@angular/common';
import { DetailsFieldComponent } from '../../../../shared/components/details-field/details-field.component';
import { DateInputComponent } from '../../../../shared/components/date-input/date-input.component';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

type RowData = Member;

@Component({
  selector: 'app-add-update-delete-members-dialog',
  imports: [
    CustomDialogComponent,
    ReactiveFormsModule,
    TextInputComponent,
    TagModule,
    DecimalPipe,
    DetailsFieldComponent,
    ToggleSwitchModule,
    DateInputComponent,
    FormsModule,
  ],
  templateUrl: './members-crud-dialog.component.html',
  styleUrl: './members-crud-dialog.component.scss',
})
export class MembersCrudDialogComponent extends BaseForm implements OnChanges {
  dialogConfig = model<DialogConfig<RowData>>(null);
  dialogVisible = model(false);
  confirmDialogChange = output<DialogConfirm<RowData>>();
  hasButtons = computed(() => {
    const config = this.dialogConfig();
    return config !== null && config.mode !== 'details';
  });

  // local subscription status state and toggle binding
  subscriptionStatus = model<'active' | 'inactive'>('inactive');
  checked = model<boolean>(false);

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
      phone: ['', [Validators.minLength(11), Validators.maxLength(11)]],
      address: ['', []],
      subscriptionStartDate: [startDate, [Validators.required]],
      subscriptionEndDate: [endDate, [Validators.required]],
    });
  }
  openDialog() {
    this.dialogVisible.set(true);

    if (this.dialogConfig()?.mode === 'update' && this.dialogConfig()?.row) {
      this.form.reset();
      this.form.patchValue(this.dialogConfig()?.row!); // prefill form for update
      this.setSubscriptionStatusFromDialog();
    } else if (this.dialogConfig()?.mode === 'add') {
      this.form = this.buildForm();
      this.subscriptionStatus.set('active');
      this.checked.set(true);
    }
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
    if (!this.form.valid) return;

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
}
