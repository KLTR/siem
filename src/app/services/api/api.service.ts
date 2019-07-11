import { Injectable } from '@angular/core';
import { SailsModel, Sails, SailsQuery, RequestCriteria, SailsRequest, SailsResponse,
         SailsSubscription, SailsEvent } from 'ngx-sails-socketio';
import { map, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  request: SailsRequest;
  socket: SailsSubscription;
  public user: any;

  serverUrls = {
    getSocketInfo: '/api/socketinfo',
    login: '/api/auth/login',
    register: '/api/auth/register',
    isRegisteredEmail: '/api/auth/isregisterdemail', // email in body
    forgotPassword: '/api/auth/forgot_password', // email in body
    saveUsername: '/api/peer/save_username',
    authMe: '/api/auth/me',
    updateEmailNotifications: '/api/peer/updateEmailNotifications',
    authPassword: '/api/auth/authPass',
    resetPassword: '/api/auth/reset_login_password',
  };

  constructor(private sails: Sails) {
    this.request = new SailsRequest(this.sails);
    this.decodeToken();
  }

  getToken(): string {
    const token = localStorage.getItem('COPA/JWT');
    return token;
  }
  setToken(token: string): void {
    localStorage.removeItem(`COPA/JWT`);
    localStorage.setItem(`COPA/JWT`, token);
    this.decodeToken();
  }
  updateEmailNotifications(subscribe: boolean): Observable<SailsResponse> {
    return this.request.post(`${this.serverUrls.updateEmailNotifications}`, {subscribe});
  }


  decodeToken(): void {
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(this.getToken());
    this.user = decodedToken;
    console.log(decodedToken);
  }

  getUser(): any {
    return this.user;
  }


  getSocketInfo() {
    this.request.get(`${this.serverUrls.getSocketInfo}`).subscribe((res) => {
    });
  }

  saveUsername(username): Observable<SailsResponse> {
    return this.request.post(`${this.serverUrls.saveUsername}`, {username});
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

  authMe(): Observable<SailsResponse> {
    return this.request.get(`${this.serverUrls.authMe}`);
  }

  authPassword(password: string): Observable<SailsResponse> {
    return this.request.post(`${this.serverUrls.authPassword}`, {password});
  }
  resetPassword(pass: string, confirmed: string): Observable<SailsResponse> {
    return this.request.post(`${this.serverUrls.resetPassword}`, {pass, confirmed});
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
