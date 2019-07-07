import { SailsRequestOptions, SailsResponse, SailsInterceptorInterface, SailsInterceptorHandlerInterface } from 'ngx-sails-socketio';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable()
export class SailsInterceptorService implements SailsInterceptorInterface {

    constructor(private router: Router) {
    }

    intercept(request: SailsRequestOptions, next: SailsInterceptorHandlerInterface): Observable<SailsResponse> {
      // if(!request.url.includes('logout')) {
      // }
      request.clone({
          headers: request.headers.set('Authorization', `Bearer ${localStorage.getItem('COPA/JWT')}`)
      });
      const response = next.handle(request);

      return response.pipe(map((res: SailsResponse) => {
          console.log(res);
          if (res.getStatusCode() === 401) {
              this.router.navigateByUrl('login');
          }
          return res;
      }));
  }
}
