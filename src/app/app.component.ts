import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastComponent } from './core/components/toast.component';
import { SpinnerComponent } from './core/components/spinner.component';
import { Members } from './features/members/pages/members/members.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CheckboxModule,
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
