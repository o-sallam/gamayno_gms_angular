import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CheckboxModule } from 'primeng/checkbox';
import { Button } from './shared/components/button/button';
import { TextInputComponent } from "./shared/components/text-input/text-input";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CheckboxModule, Button, TextInputComponent],
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
