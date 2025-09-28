import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ApiState, HttpOptions } from '../models/http-models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private readonly BASE_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  get<T>(
    url: string,
    state: ApiState<T>,
    options?: HttpOptions
  ): Observable<T> {
    this.startLoading(state);

    return this.http
      .get<T>(`${this.BASE_URL}${url}`, {
        params: options?.params,
        context: options?.context,
      })
      .pipe(
        tap({
          next: (data) => this.setSuccess(data, state),
          error: (err: HttpErrorResponse) => this.setError(err, state),
        })
      );
  }

  post<T>(url: string, body: any, options?: HttpOptions): Observable<T> {
    return this.http.post<T>(`${this.BASE_URL}${url}`, body, {
      params: options?.params,
      context: options?.context,
    });
  }

  put<T>(url: string, body: any, options?: HttpOptions): Observable<T> {
    return this.http.put<T>(`${this.BASE_URL}${url}`, body, {
      params: options?.params,
      context: options?.context,
    });
  }

  delete<T>(url: string, options?: HttpOptions): Observable<T> {
    return this.http.delete<T>(`${this.BASE_URL}${url}`, {
      params: options?.params,
      context: options?.context,
    });
  }
  // helpers
  private startLoading<T>(state?: ApiState<T>) {
    if (!state) return;
    state = {
      loading: true,
      response: state.response,
      error: null,
    };
  }

  private setSuccess<T>(data: T, state?: ApiState<T>) {
    if (!state) return;
    state = {
      loading: false,
      response: data,
      error: null,
    };
  }

  private setError<T>(err: HttpErrorResponse, state?: ApiState<T>) {
    if (!state) return;
    state = {
      loading: false,
      response: null,
      error: err.message || 'Something went wrong',
    };
  }
}
