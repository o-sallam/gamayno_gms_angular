import { Injectable, signal } from '@angular/core';
import {
  HttpClient,
  HttpContext,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { finalize, Observable, tap } from 'rxjs';

export interface ApiState<T> {
  loading: boolean;
  data: T | null;
  error: string | null;
}
interface HttpOptions {
  params?:
    | HttpParams
    | Record<
        string,
        string | number | boolean | ReadonlyArray<string | number | boolean>
      >;

  context?: HttpContext;
}
@Injectable({
  providedIn: 'root',
})
export class HttpService {
  // global loading signal (for global spinner if needed)
  loading = signal(false);

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
          next: (data) => this.setSuccess(state, data),
          error: (err: HttpErrorResponse) => this.setError(state, err),
        }),
        finalize(() => this.loading.set(false))
      );
  }

  post<T>(
    url: string,
    body: any,
    state: ApiState<T>,
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
          next: (data) => this.setSuccess(state, data),
          error: (err: HttpErrorResponse) => this.setError(state, err),
        }),
        finalize(() => this.loading.set(false))
      );
  }

  put<T>(
    url: string,
    body: any,
    state: ApiState<T>,
    options?: HttpOptions
  ): Observable<T> {
    this.startLoading(state);

    return this.http
      .put<T>(url, body, { params: options?.params, context: options?.context })
      .pipe(
        tap({
          next: (data) => this.setSuccess(state, data),
          error: (err: HttpErrorResponse) => this.setError(state, err),
        }),
        finalize(() => this.loading.set(false))
      );
  }

  delete<T>(url: string, state: ApiState<T>): Observable<T> {
    this.startLoading(state);

    return this.http.delete<T>(url).pipe(
      tap({
        next: (data) => this.setSuccess(state, data),
        error: (err: HttpErrorResponse) => this.setError(state, err),
      }),
      finalize(() => this.loading.set(false))
    );
  }

  // helpers
  private startLoading<T>(state: ApiState<T>) {
    this.loading.set(true);
    state.loading = true;
    state.error = null;
  }

  private setSuccess<T>(state: ApiState<T>, data: T) {
    state.loading = false;
    state.data = data;
    state.error = null;
  }

  private setError<T>(state: ApiState<T>, err: HttpErrorResponse) {
    state.loading = false;
    state.data = null;
    state.error = err.message || 'Something went wrong';
  }
}
