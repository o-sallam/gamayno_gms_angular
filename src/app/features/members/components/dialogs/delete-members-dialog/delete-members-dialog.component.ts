import { Component, input, model, output } from '@angular/core';
import { Member } from '../../../models/member.model';
import { CustomDialogComponent } from '../../../../../core/components/dialog.component';

type RowData = Member;

@Component({
  selector: 'app-delete-members-dialog',
  standalone: true,
  imports: [CustomDialogComponent],
  template: `
    <app-dialog
      [visible]="dialogVisible()"
      [title]="'Delete Member'"
      (confirm)="onSubmit()"
      (close)="closeDialog()"
      [hasButtons]="true"
    >
      <div class="flex flex-col gap-4">
        <p class="text-lg">Are you sure you want to delete this member?</p>
        @if (data()?.code) {
        <p class="text-md font-semibold">Member Code: {{ data()?.code }}</p>
        }
      </div>
    </app-dialog>
  `,
})
export class DeleteMembersDialogComponent {
  data = input<RowData | null>(null);
  dialogVisible = model(false);
  primaryClick = output<RowData>();
  close = output<void>();

  closeDialog() {
    this.close.emit();
  }

  onSubmit() {
    this.primaryClick.emit(this.data()!);
  }
}
