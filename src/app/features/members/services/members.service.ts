import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Member } from '../models/member.model';
import { ApiState, HttpService } from '../../../core/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  // signals for state management
  members = signal<ApiState<Member[]>>({
    loading: false,
    data: null,
    error: null,
  });

  member = signal<ApiState<Member>>({
    loading: false,
    data: null,
    error: null,
  });

  constructor(private http: HttpService) {}

  getAll(): Observable<Member[]> {
    return this.http.get<Member[]>('/api/members', this.members());
  }

  getById(id: number): Observable<Member> {
    return this.http.get<Member>(`/api/members/${id}`, this.member());
  }

  create(member: Partial<Member>): Observable<Member> {
    return this.http.post<Member>('/api/members', member, this.member());
  }

  update(id: number, member: Partial<Member>): Observable<Member> {
    return this.http.put<Member>(`/api/members/${id}`, member, this.member());
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`/api/members/${id}`, this.member());
  }
}
