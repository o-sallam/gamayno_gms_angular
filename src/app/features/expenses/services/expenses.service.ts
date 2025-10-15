import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Expense } from '../models/expense.model';
import { TableFilterBody } from '../../../shared/components/table/table.component';
import { ApiState, ApiResponse } from '../../../core/models/http-models';
import { HttpService } from '../../../core/services/http.service';
import { ParamatersParser } from '../../../core/config/paramaters-parser';

type RowData = Expense;
type PartialRowData = Partial<Expense>;

@Injectable({
  providedIn: 'root',
})
export class ExpensesService {
  private apiUrl = 'expenses';
  expensesState = signal<ApiState<ApiResponse<RowData[]>>>({
    response: null,
    loading: false,
    error: null,
  });

  constructor(private http: HttpService) {}

  getAll(filterBody?: TableFilterBody): Observable<ApiResponse<RowData[]>> {
    const params = ParamatersParser.parseTableFilter(filterBody);

    return this.http.get<ApiResponse<RowData[]>>(
      this.apiUrl,
      this.expensesState(),
      {
        params,
      }
    );
  }

  create(expense: PartialRowData): Observable<ApiResponse<RowData>> {
    return this.http.post<{ data: RowData }>(`${this.apiUrl}`, expense);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
