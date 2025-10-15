import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Revenue } from '../models/revenue.model';
import { TableFilterBody } from '../../../shared/components/table/table.component';
import { ApiState, ApiResponse } from '../../../core/models/http-models';
import { HttpService } from '../../../core/services/http.service';
import { ParamatersParser } from '../../../core/config/paramaters-parser';

type RowData = Revenue;
type PartialRowData = Partial<Revenue>;

@Injectable({
  providedIn: 'root',
})
export class RevenuesService {
  private apiUrl = 'revenues';
  revenuesState = signal<ApiState<ApiResponse<RowData[]>>>({
    response: null,
    loading: false,
    error: null,
  });

  constructor(private http: HttpService) {}

  getAll(filterBody?: TableFilterBody): Observable<ApiResponse<RowData[]>> {
    const params = ParamatersParser.parseTableFilter(filterBody);

    return this.http.get<ApiResponse<RowData[]>>(
      this.apiUrl,
      this.revenuesState(),
      {
        params,
      }
    );
  }

  create(revenue: PartialRowData): Observable<ApiResponse<RowData>> {
    return this.http.post<{ data: RowData }>(`${this.apiUrl}`, revenue);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
