import { HttpParams, HttpContext } from '@angular/common/http';

export interface ApiState<T> {
  loading: boolean;
  response: T | null;
  error: string | null;
}
export interface HttpOptions {
  params?:
    | HttpParams
    | Record<
        string,
        string | number | boolean | ReadonlyArray<string | number | boolean>
      >;

  context?: HttpContext;
}
export interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data: T;
}
