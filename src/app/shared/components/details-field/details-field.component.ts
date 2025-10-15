import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { Tag, TagModule } from 'primeng/tag';

@Component({
  selector: 'app-details-field',
  imports: [Tag, TagModule, DatePipe],
  templateUrl: './details-field.component.html',
  styleUrl: './details-field.component.scss',
})
export class DetailsFieldComponent {
  label = input.required<string>();
  type = input.required<'tag' | 'text' | 'date' | 'custom'>();
  value = input.required<any>();
  severity = input<string>();
}
