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
  selector: 'app-update-member-dialog',
  templateUrl: './update-member-dialog.component.html',
  imports: [
    CustomDialogComponent,
    ReactiveFormsModule,
    TextInputComponent,
    DateInputComponent,
  ],
})
export class UpdateMemberDialogComponent {
  @Input() set visible(value: boolean) {
    this.dialogVisible.set(value);
  }
  @Input() set member(value: any) {
    if (value) {
      this.updateForm.patchValue({
        name: value.name,
        code: value.code,
        phone: value.phone,
        address: value.address,
        subscriptionStartDate: value.subscriptionStartDate,
        subscriptionEndDate: value.subscriptionEndDate,
      });
    }
  }

  @Output() close = new EventEmitter<void>();
  @Output() primaryClick = new EventEmitter<any>();

  dialogVisible = signal(false);
  updateForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.updateForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      phone: [''],
      address: [''],
      subscriptionStartDate: [null],
      subscriptionEndDate: [null],
    });
  }

  onSubmit() {
    if (this.updateForm.valid) {
      this.primaryClick.emit(this.updateForm.value);
    }
  }

  onClose() {
    this.close.emit();
  }
}
