import { Component, input, output } from '@angular/core';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-table',
  templateUrl: './table.html',
  imports: [TableModule],
})
export class TableComponent {
  columns = input.required<{ field: string; header: string }[]>();
  data = input.required<any[]>();
  sort = output();

  // ✅ Custom sorting logic
  customSort(event: any) {
    this.sort.emit(event);
  }
}
