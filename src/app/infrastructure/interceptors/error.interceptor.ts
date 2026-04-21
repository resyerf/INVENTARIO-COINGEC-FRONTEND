import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMsg = '';
        if (error.error instanceof ErrorEvent) {
          errorMsg = `Error del Cliente: ${error.error.message}`;
        } else {
          // You could extract better info if passing JSON from backend
          errorMsg = `Error del Servidor [${error.status}]: ${error.message}`;
        }
        
        // Throw an alert to explicitly notify the user for our global coverage
        alert(`Ha ocurrido un inconveniente de red:\n${errorMsg}`);
        console.error('Error interceptado globalmente:', error);

        return throwError(() => new Error(errorMsg));
      })
    );
  }
}
