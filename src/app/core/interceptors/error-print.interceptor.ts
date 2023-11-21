import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotificationService } from '../notification.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class ErrorPrintInterceptor implements HttpInterceptor {
  constructor(private readonly notificationService: NotificationService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap({
        error: (errorResponse: unknown) => {
          const url = new URL(request.url);
          const genericErrorMessage = `Request to "${url.pathname}" failed. Check the console for the details`;
          const errorMessage = errorResponse instanceof HttpErrorResponse
              ? this.noAccess(errorResponse.status)
                ? errorResponse.error.message
                : genericErrorMessage
              : genericErrorMessage;

          this.notificationService.showError(errorMessage, 0);
        },
      })
    );
  }

  private noAccess(errorStatus: HttpStatusCode): boolean {
    return errorStatus === (HttpStatusCode.Forbidden || HttpStatusCode.Unauthorized);
  }
}

