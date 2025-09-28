import { Component, effect } from '@angular/core';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-toast',
  template: `
    @if(visible){
    <div
      class="toast"
      [class.show]="visible"
      [class.error]="type === 'error'"
      [class.success]="type === 'success'"
    >
      {{ message }}
    </div>
    }
  `,
  styles: [
    `
      .toast {
        position: fixed;
        top: 20px;
        right: 50%;
        transform: translateX(50%);
        padding: 12px 20px;
        border-radius: 6px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
        color: white;
      }
      .toast.show {
        opacity: 1;
      }
      .toast.error {
        background: var(--dark-red);
        color: var(--red);
      }
      .toast.success {
        background: var(--dark-green);
        color: var(--green);
      }
    `,
  ],
})
export class ToastComponent {
  message = '';
  visible = false;
  type: 'success' | 'error' = 'success';
  private timeoutId?: any;

  constructor(private messageService: MessageService) {
    // Watch error
    effect(() => {
      const err = this.messageService.error();
      if (err) {
        this.showToast(err, 'error');
      }
    });

    // Watch success
    effect(() => {
      const msg = this.messageService.success();
      if (msg) {
        this.showToast(msg, 'success');
      }
    });
  }

  private showToast(message: string, type: 'success' | 'error') {
    this.message = message;
    this.type = type;
    this.visible = true;

    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.visible = false;
      type === 'error'
        ? this.messageService.clearError()
        : this.messageService.clearSuccess();
    }, 4000);
  }
}
