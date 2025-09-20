import { Component, input, output, ViewChild } from '@angular/core';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';

export interface TableFilterBody {
  sort: { field: string; order: number };
  filter: { value: string; field: string }[];
  lastRow: number;
}
@Component({
  selector: 'app-table',
  templateUrl: './table.html',
  imports: [TableModule, InputTextModule],
})
export class TableComponent {
  // 👇 ViewChild
  @ViewChild('dt') dt!: Table;

  // 👇 Inputs
  columns = input.required<{ field: string; header: string }[]>();
  data = input.required<any[]>();
  totalRecords = input.required<number>();

  // 👇 Outputs
  fetch = output<TableFilterBody>();

  // 👇 Locals
  filterBody: TableFilterBody = {
    sort: { field: '', order: 0 },
    filter: [],
    lastRow: 0,
  };
  loading = false;
  lastSortField: string | null = null;
  lastSortOrder: number | null = null;
  lastFirst = 0;

  // ✅ Custom sorting logic
  // customSort(event: SortEvent) {
  //   this.filterBody.sort = { field: event.field!, order: event.order! };

  //   this.fetch.emit(this.filterBody);
  // }

  onFilterBySearch(e: Event, field: string) {
    const value = (e.target as HTMLInputElement).value;

    const index = this.filterBody.filter.findIndex((f) => f.field === field);

    if (index !== -1) {
      this.filterBody.filter[index].value = value;
    } else {
      this.filterBody.filter.push({ field, value });
    }

    this.emitData();
  }

  fetchMore(event: TableLazyLoadEvent) {
    const isSortChanged = this.emitWhenSort(event);
    if (isSortChanged) return;

    const isScrollChanged = this.emitWhenScroll(event);
    if (isScrollChanged) return;

    console.log('Triggered by something else (maybe filter)');
  }
  emitWhenSort(event: TableLazyLoadEvent): boolean {
    const sortField = event.sortField as string | null;
    const isSortChanged =
      event.sortField !== this.lastSortField ||
      event.sortOrder !== this.lastSortOrder;

    if (!isSortChanged) {
      return false;
    }

    console.log('Triggered by SORT');
    const isReset = this.hasBeenReset(sortField!, event.sortOrder!);
    if (!isReset) {
      this.lastSortField = sortField ?? null;
      this.lastSortOrder = event.sortOrder ?? null;
      this.lastFirst = event.first ?? 0;
      this.filterBody.sort = {
        field: this.lastSortField!,
        order: this.lastSortOrder!,
      };
    }

    // reset & load fresh data from backend
    this.emitData();
    return true;
  }
  hasBeenReset(field: string, order: number): boolean {
    if (this.lastSortField === field && order === 1) {
      console.log('Triggered by RESET');

      this.dt.reset();
      this.lastSortField = null;
      this.filterBody.sort = { field: '', order: 0 };

      return true;
    }
    return false;
  }
  emitWhenScroll(event: TableLazyLoadEvent): boolean {
    const isScroll =
      event.first !== undefined && event.first !== this.lastFirst;

    if (isScroll) {
      console.log('Triggered by SCROLL → first:', event.first);
      this.lastFirst = event.first ?? 0;
      this.filterBody.lastRow = event.last ?? 0;

      // append more data while keeping sort
      this.emitData();
      return true;
    }

    return false;
  }
  lazyLoad(event: TableLazyLoadEvent) {
    // Triggered when scrolling or sorting or filtering
    // this.loading = true;
    if (event.first == 0) {
      // prevent triggering on first load (first rendering)
      return;
    }
    this.fetchMore(event);
  }
  emitData() {
    this.fetch.emit(this.filterBody);
  }
}
