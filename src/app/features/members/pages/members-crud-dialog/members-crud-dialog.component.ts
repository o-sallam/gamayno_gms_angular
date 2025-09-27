import {
  Component,
  computed,
  model,
  OnChanges,
  output,
  SimpleChanges,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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

  constructor() {
    super();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dialogConfig'] && this.dialogConfig()) {
      this.openDialog();
    }
  }
  protected buildForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
    });
  }
  openDialog() {
    this.dialogVisible.set(true);

    if (this.dialogConfig()?.mode === 'update' && this.dialogConfig()?.row) {
      this.form.patchValue(this.dialogConfig()?.row!); // prefill form for update
    } else if (
      this.dialogConfig()?.mode !== 'details' &&
      this.dialogConfig()?.mode !== 'delete'
    ) {
      this.form.reset();
    }
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

    this.confirmDialogChange.emit({
      mode: config.mode,
      data: this.form.value,
    });

    this.closeDialog();
  }
}
