import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (localStorage.getItem('userToken')) {
      // If User is logged return true
      return true;
    } else {
      console.log('redirecting ..');
      this.router.navigate(['login']);
      return false;
    }
  }
}
