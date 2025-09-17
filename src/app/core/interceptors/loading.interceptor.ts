import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpContextToken } from '@angular/common/http';
import { LoadingService } from '../services/loading.service';
import { finalize } from 'rxjs';

export const ENABLE_LOADING = new HttpContextToken<boolean>(() => false);
export const ENABLE_ERROR = new HttpContextToken<boolean>(() => false);

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  const useLoading = req.context.get(ENABLE_LOADING);

  if (!useLoading) {
    return next(req);
  }

  loadingService.setLoading(true);

  return next(req).pipe(finalize(() => loadingService.setLoading(false)));
};
