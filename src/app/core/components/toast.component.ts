import { Component, effect } from '@angular/core';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-toast',
  template: `
    @if(visible){
    <div class="toast" [class.show]="visible">
      {{ message }}
    </div>
    }
  `,
  styles: [
    `
      .toast {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #f44336;
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
      }
      .toast.show {
        opacity: 1;
      }
    `,
  ],
})
export class ToastComponent {
  message = '';
  visible = false;
  private timeoutId?: any;

  constructor(private errorService: MessageService) {
    effect(() => {
      const err = this.errorService.error();
      if (err) {
        this.showToast(err);
      }
    });
  }

  private showToast(message: string) {
    this.message = message;
    this.visible = true;

    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.visible = false;
      this.errorService.clearError();
    }, 4000); // auto-hide after 4s
  }
}
