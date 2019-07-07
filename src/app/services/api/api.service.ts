import { Injectable } from '@angular/core';
import { SailsModel, Sails, SailsQuery, RequestCriteria, SailsRequest, SailsResponse, SailsSubscription } from 'ngx-sails-socketio';
import { map, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  request: SailsRequest;
  user: any;

  serverUrls = {
    getSocketInfo: '/api/socketinfo',
    login: '/api/auth/login',
    register: '/api/auth/register',
    getMe: '/api/auth/me',
    isRegisteredEmail: '/api/auth/isregisterdemail', // email in body
    forgotPassword: 'api/auth/forgot_password', // email in body
  };

  constructor(private sails: Sails) {
    this.request = new SailsRequest(this.sails);
  }
  getToken(): any {
    const token = localStorage.getItem('COPA/JWT');
    console.log(token);
    return token;
  }

  decodeToken(): void {
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(this.getToken());
    console.log(decodedToken);
  }

  getSocketInfo() {
    this.request.get(`${this.serverUrls.getSocketInfo}`).subscribe((res) => {
      console.log(res.getBody());
    });
  }

  login(credentials): Observable<SailsResponse> {
    return this.request.post(`${this.serverUrls.login}`, credentials);
  }

  register(credentials): Observable<SailsResponse> {
    return this.request.post(`${this.serverUrls.register}`, credentials);
  }

  setUser(user: any): void {
    this.user = user;
  }

  getMe(): Observable<SailsResponse> {
    return this.request.get(`${this.serverUrls.getMe}`, );
  }

// searchEmail(terms: Observable<string>): any {
//   return terms.pipe(
//     debounceTime(400),
//     distinctUntilChanged(),
//     switchMap(term => this.isRegisteredEmail(term))
//   );
// }
  isRegisteredEmail(email): Observable<SailsResponse> {
    return this.request.get(`${this.serverUrls.isRegisteredEmail}`);
      // .pipe(
      // map( (res: any) => res.json()),
      // map( emails => emails.filter(email => email === emailToCheck)),
      // map( emails => !emails.length)
    // );
  }
}
