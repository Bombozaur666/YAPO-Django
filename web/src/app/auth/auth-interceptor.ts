import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';

import { catchError, switchMap, throwError } from 'rxjs';
import {AuthService} from './auth-service';

const PUBLIC_ENDPOINTS: string[] = ['/login', '/register', '/refresh', "/share"];
const PUBLIC_DYNAMIC_PATTERNS: RegExp[] = [
  /\/plants\/[^\/]+\/photo\/[^\/]+/
];

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);

  const isPublicStatic: boolean = PUBLIC_ENDPOINTS.some(endpoint => req.url.includes(endpoint));
  const isPublicDynamic: boolean = PUBLIC_DYNAMIC_PATTERNS.some(pattern => pattern.test(req.url)) && req.method === 'GET';

  if (isPublicStatic || isPublicDynamic) {
    return next(req);
  }

  const token = authService.token;

  let headers = req.headers;
  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  if (req.body instanceof FormData) {
    headers = headers.delete('Content-Type');
  }

  const authReq = req.clone({ headers });

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 403) {
        return authService.refresh().pipe(
          switchMap((res) => {
            if (!res?.accessToken) {
              return throwError(() => err);
            }
            const retried = req.clone({
              setHeaders: { Authorization: `Bearer ${res.accessToken}` }
            });
            return next(retried);
          })
        );
      }
      return throwError(() => err);
    })
  );
};
