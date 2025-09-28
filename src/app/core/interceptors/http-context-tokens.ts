import { HttpContextToken } from '@angular/common/http';

export const ENABLE_LOADING = new HttpContextToken<boolean>(() => true);
export const ENABLE_ERROR = new HttpContextToken<boolean>(() => true);
export const ENABLE_SUCCESS = new HttpContextToken<boolean>(() => false);
