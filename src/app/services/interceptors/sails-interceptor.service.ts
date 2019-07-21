import { SailsRequestOptions, SailsResponse, SailsInterceptorInterface, SailsInterceptorHandlerInterface } from 'ngx-sails-socketio';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ErrorService } from '../error/error.service';
@Injectable()
export class SailsInterceptorService implements SailsInterceptorInterface {

    constructor(private router: Router, private errorService: ErrorService) {
    }

    intercept(request: SailsRequestOptions, next: SailsInterceptorHandlerInterface): Observable<SailsResponse> {
      request.clone({
          headers: request.headers.set('Authorization', `Bearer ${localStorage.getItem('COPA/JWT')}`)
      });
      const response = next.handle(request);
      response.subscribe(
        () => { },
        (err) => {
          this.errorService.logError(err);
        }
        );
      return response.pipe(map((res: SailsResponse) => {
          if (res.getStatusCode() === 401) {
              this.router.navigateByUrl('login');
          }
          return res;
      }));
  }
}
