import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Member } from '../models/member.model';
import { HttpService } from '../../../core/services/http.service';
import { TableFilterBody } from '../../../shared/components/table/table.component';
import { ParamatersParser } from '../../../core/config/paramaters-parser';
import { ApiResponse, ApiState } from '../../../core/models/http-models';
import { HttpContext } from '@angular/common/http';
import { ENABLE_SUCCESS } from '../../../core/interceptors/http-context-tokens';
type RowData = Member;
type PartialRowData = Partial<RowData>;
@Injectable({
  providedIn: 'root',
})
export class MembersService {
  // signals for state management

  private MOCK_MEMBERS: RowData[] = [
    {
      id: 1,
      code: 'M001',
      name: 'John',
      balance: 1368.63,
      debt: 4457.87,
      credit: 308.08,
      address: 'Los Angeles',
      phone: '+1-555-9134',
      status: 'active',
    },
    {
      id: 2,
      code: 'M002',
      name: 'Alice',
      balance: 255.0,
      debt: 859.38,
      credit: 2357.74,
      address: 'Dallas',
      phone: '+1-555-6977',
      status: 'active',
    },
    {
      id: 3,
      code: 'M003',
      name: 'Michael',
      balance: 5162.65,
      debt: 2390.72,
      credit: 465.79,
      address: 'Philadelphia',
      phone: '+1-555-3140',
      status: 'inactive',
    },
    {
      id: 4,
      code: 'M004',
      name: 'Sophia',
      balance: 3930.56,
      debt: 1205.61,
      credit: 3422.37,
      address: 'Philadelphia',
      phone: '+1-555-2025',
      status: 'inactive',
    },
    {
      id: 5,
      code: 'M005',
      name: 'David',
      balance: 1757.08,
      debt: 3355.42,
      credit: 3800.01,
      address: 'Los Angeles',
      phone: '+1-555-1155',
      status: 'inactive',
    },
    {
      id: 6,
      code: 'M006',
      name: 'Emma',
      balance: 8191.06,
      debt: 2162.84,
      credit: 2504.32,
      address: 'Houston',
      phone: '+1-555-6432',
      status: 'active',
    },
    {
      id: 7,
      code: 'M007',
      name: 'Chris',
      balance: 6167.61,
      debt: 2618.68,
      credit: 3867.4,
      address: 'Phoenix',
      phone: '+1-555-4332',
      status: 'active',
    },
    {
      id: 8,
      code: 'M008',
      name: 'Olivia',
      balance: 5905.58,
      debt: 442.38,
      credit: 571.92,
      address: 'San Diego',
      phone: '+1-555-3815',
      status: 'active',
    },
    {
      id: 9,
      code: 'M009',
      name: 'Daniel',
      balance: 7642.93,
      debt: 4240.79,
      credit: 5278.88,
      address: 'Los Angeles',
      phone: '+1-555-9723',
      status: 'active',
    },
    {
      id: 10,
      code: 'M010',
      name: 'Ava',
      balance: 1249.83,
      debt: 4102.92,
      credit: 3487.41,
      address: 'Philadelphia',
      phone: '+1-555-9140',
    },
    {
      id: 11,
      code: 'M011',
      name: 'Ethan',
      balance: 5718.57,
      debt: 280.86,
      credit: 5874.05,
      address: 'Los Angeles',
      phone: '+1-555-2872',
    },
    {
      id: 12,
      code: 'M012',
      name: 'Mia',
      balance: 5771.77,
      debt: 1137.35,
      credit: 4390.04,
      address: 'Houston',
      phone: '+1-555-5595',
    },
    {
      id: 13,
      code: 'M013',
      name: 'James',
      balance: 6187.63,
      debt: 1064.83,
      credit: 1772.33,
      address: 'Chicago',
      phone: '+1-555-8655',
    },
    {
      id: 14,
      code: 'M014',
      name: 'Isabella',
      balance: 5323.6,
      debt: 4645.22,
      credit: 6393.09,
      address: 'Houston',
      phone: '+1-555-6383',
    },
    {
      id: 15,
      code: 'M015',
      name: 'William',
      balance: 7076.84,
      debt: 850.51,
      credit: 735.8,
      address: 'New York',
      phone: '+1-555-6043',
    },
    {
      id: 16,
      code: 'M016',
      name: 'Charlotte',
      balance: 2173.16,
      debt: 2923.58,
      credit: 2302.99,
      address: 'Philadelphia',
      phone: '+1-555-7947',
    },
    {
      id: 17,
      code: 'M017',
      name: 'Alexander',
      balance: 790.67,
      debt: 2455.22,
      credit: 3788.37,
      address: 'Dallas',
      phone: '+1-555-4418',
    },
    {
      id: 18,
      code: 'M018',
      name: 'Amelia',
      balance: 2121.41,
      debt: 1048.93,
      credit: 4640.89,
      address: 'San Antonio',
      phone: '+1-555-8804',
    },
    {
      id: 19,
      code: 'M019',
      name: 'Benjamin',
      balance: 2933.23,
      debt: 1863.71,
      credit: 1353.7,
      address: 'Philadelphia',
      phone: '+1-555-3987',
    },
    {
      id: 20,
      code: 'M020',
      name: 'Harper',
      balance: 8321.78,
      debt: 1258.03,
      credit: 2138.83,
      address: 'San Antonio',
      phone: '+1-555-3998',
    },
  ];

  membersState = signal<ApiState<ApiResponse<RowData[]>>>({
    loading: false,
    response: { data: this.MOCK_MEMBERS },
    error: null,
  });

  memberState = signal<ApiState<ApiResponse<RowData>>>({
    loading: false,
    response: null,
    error: null,
  });

  constructor(private http: HttpService) {}

  getAll(filterBody?: TableFilterBody): Observable<ApiResponse<RowData[]>> {
    const params = ParamatersParser.parseTableFilter(filterBody);

    return this.http.get<ApiResponse<RowData[]>>(
      'members',
      this.membersState(),
      {
        params,
      }
    );
  }

  getById(id: number): Observable<ApiResponse<RowData>> {
    return this.http.get<ApiResponse<RowData>>(
      `members/${id}`,
      this.memberState()
    );
  }

  create(member: PartialRowData): Observable<ApiResponse<RowData>> {
    return this.http.post<ApiResponse<RowData>>('members', member, {
      context: new HttpContext().set(ENABLE_SUCCESS, true),
    });
  }

  update(id: number, member: PartialRowData): Observable<ApiResponse<RowData>> {
    return this.http.put<ApiResponse<RowData>>(`members/${id}`, member, {
      context: new HttpContext().set(ENABLE_SUCCESS, true),
    });
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`members/${id}`, {
      context: new HttpContext().set(ENABLE_SUCCESS, true),
    });
  }
}
