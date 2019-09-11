import { map } from 'rxjs/operators';
import { ApiService } from '@app/services';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  user: any;
  constructor(
    private router: Router,
    private apiSerivce: ApiService) {
      this.apiSerivce.user.subscribe( user => {
        this.user = user;
      });
    }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.user) {
      return true;
    } else {
      return this.apiSerivce.getUser().pipe(
        map(user => {
          if (user) {
            return true;
          } else {
            this.router.navigateByUrl('login');
            return false;
          }
        })
      );
    }
  }
}
