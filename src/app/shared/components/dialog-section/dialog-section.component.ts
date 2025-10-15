import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-dialog-section',
  imports: [NgClass],
  templateUrl: './dialog-section.component.html',
  styleUrl: './dialog-section.component.scss',
})
export class DialogSectionComponent {
  title = input.required<string>();
  hasBorderTop = input<boolean>(true);
}
