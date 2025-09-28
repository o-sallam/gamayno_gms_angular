import { Component, EventEmitter, Input, input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [DialogModule, ButtonModule, InputTextModule],
  template: `
    <p-dialog
      [modal]="true"
      [(visible)]="visible"
      [style]="{ width: '25rem' }"
      (onHide)="onClose()"
    >
      <ng-template pTemplate="header">
        <p class="m-0 font-medium text-lg">{{ title() }}</p>
      </ng-template>

      <ng-content></ng-content>
      <!-- slot for extra form fields -->

      <ng-template pTemplate="footer">
        @if(hasButtons()){
        <div class="flex justify-end gap-2">
          <p-button
            [label]="secondaryLabel()"
            severity="secondary"
            (click)="onClose()"
          />
          <p-button [label]="primaryLabel()" (click)="onPrimaryClick()" />
        </div>
        }
      </ng-template>
    </p-dialog>
  `,
})
export class CustomDialogComponent {
  // signals
  @Input() visible = false;
  title = input('Dialog');
  primaryLabel = input('Save');
  secondaryLabel = input('Cancel');
  hasButtons = input(true);

  @Output() primaryClick = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  onPrimaryClick() {
    this.primaryClick.emit();
  }

  onClose() {
    this.close.emit();
  }
}
