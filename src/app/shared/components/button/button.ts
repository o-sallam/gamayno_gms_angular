import { Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-button',
  imports: [ButtonModule],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  icon = input('');
  bgColor = input<string>('');
  disabled = input(false);
  loading = input(false);
  rounded = input(true);
  outlined = input(false);
  type = input<'button' | 'submit'>('button');

  onClick = output();

  handleClick(event: Event) {
    this.onClick.emit();
  }
}
