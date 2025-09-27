import { Injectable, signal } from '@angular/core';
import {
  HttpClient,
  HttpContext,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { finalize, Observable, tap } from 'rxjs';
import { ApiState, HttpOptions } from '../models/http-models';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  // global loading signal (for global spinner if needed)
  globalLoading = signal(false);

  constructor(private http: HttpClient) {}

  get<T>(
    url: string,
    state: ApiState<T>,
    options?: HttpOptions
  ): Observable<T> {
    this.startLoading(state);

    return this.http
      .get<T>(url, { params: options?.params, context: options?.context })
      .pipe(
        tap({
          next: (data) => this.setSuccess(data, state),
          error: (err: HttpErrorResponse) => this.setError(err, state),
        }),
        finalize(() => this.globalLoading.set(false))
      );
  }

  post<T>(
    url: string,
    body: any,
    state?: ApiState<T>,
    options?: HttpOptions
  ): Observable<T> {
    this.startLoading(state);

    return this.http
      .post<T>(url, body, {
        params: options?.params,
        context: options?.context,
      })
      .pipe(
        tap({
          next: (data) => this.setSuccess(data, state),
          error: (err: HttpErrorResponse) => this.setError(err, state),
        }),
        finalize(() => this.globalLoading.set(false))
      );
  }

  put<T>(
    url: string,
    body: any,
    state?: ApiState<T>,
    options?: HttpOptions
  ): Observable<T> {
    this.startLoading(state);

    return this.http
      .put<T>(url, body, { params: options?.params, context: options?.context })
      .pipe(
        tap({
          next: (data) => this.setSuccess(data, state),
          error: (err: HttpErrorResponse) => this.setError(err, state),
        }),
        finalize(() => this.globalLoading.set(false))
      );
  }

  delete<T>(url: string, state?: ApiState<T>): Observable<T> {
    this.startLoading(state);

    return this.http.delete<T>(url).pipe(
      tap({
        next: (data) => this.setSuccess(data, state),
        error: (err: HttpErrorResponse) => this.setError(err, state),
      }),
      finalize(() => this.globalLoading.set(false))
    );
  }

  // helpers
  private startLoading<T>(state?: ApiState<T>) {
    this.globalLoading.set(true);
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
