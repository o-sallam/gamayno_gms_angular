import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CheckboxModule } from 'primeng/checkbox';
import { Button } from './shared/components/button/button.component';
import { TextInputComponent } from './shared/components/text-input/text-input.component';
import { ToastComponent } from './core/components/toast.component';
import { SpinnerComponent } from './core/components/spinner.component';
import { Members } from './features/members/pages/members/members.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CheckboxModule,
    Button,
    TextInputComponent,
    ToastComponent,
    SpinnerComponent,
    Members,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'gamayno_gms_angular';
  checked = false;
  onChange(event: any) {
    this.checked = event.checked;
  }
}
