import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction.model';
import { TableFilterBody } from '../../../shared/components/table/table.component';
import { ApiState, ApiResponse } from '../../../core/models/http-models';
import { HttpService } from '../../../core/services/http.service';
import { ParamatersParser } from '../../../core/config/paramaters-parser';

type RowData = Transaction;
type PartialRowData = Partial<RowData>;

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  private apiUrl = 'transactions';
  transactionsState = signal<ApiState<ApiResponse<RowData[]>>>({
    response: null,
    loading: false,
    error: null,
  });

  constructor(private http: HttpService) {}

  getAll(filterBody?: TableFilterBody): Observable<ApiResponse<RowData[]>> {
    const params = ParamatersParser.parseTableFilter(filterBody);

    return this.http.get<ApiResponse<RowData[]>>(
      this.apiUrl,
      this.transactionsState(),
      {
        params,
      }
    );
  }

  create(transaction: PartialRowData): Observable<ApiResponse<RowData>> {
    return this.http.post<{ data: RowData }>(`${this.apiUrl}`, transaction);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
