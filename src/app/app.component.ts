import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CheckboxModule],
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
