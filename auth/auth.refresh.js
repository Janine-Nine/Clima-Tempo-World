import { catchError, switchMap, throwError } from 'rxjs';

return next(req).pipe(
  catchError(err => {
    if (err.status === 401) {
      return auth.refreshToken().pipe(
        switchMap((res: any) => {
          auth.saveTokens(res.accessToken, localStorage.getItem('refresh')!);

          const newReq = req.clone({
            setHeaders: {
              Authorization: res.accessToken
            }
          });

          return next(newReq);
        })
      );
    }

    return throwError(() => err);
  })
);