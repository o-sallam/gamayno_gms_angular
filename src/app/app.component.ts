import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CheckboxModule } from 'primeng/checkbox';
import { Button } from "./shared/components/button/button";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CheckboxModule, Button],
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
