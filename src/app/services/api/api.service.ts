import { Injectable } from '@angular/core';
import { SailsModel, Sails, SailsQuery, RequestCriteria, SailsRequest, SailsResponse,
         SailsSubscription, SailsEvent } from 'ngx-sails-socketio';
import { map, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  request: SailsRequest;
  socket: SailsSubscription;
  public user: BehaviorSubject<any>;
  public userObject: any;
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
    updateContactMethod: '/api/peer/update_contact_method',
    generateKey: '/api/peer/generate_key',
    updateExternalPassword: '/api/peer/update/external_password',
    updateProtectedLinkPassword: '/api/peer/update/protected_link_password',
    updateOfflineMode: '/api/peer/update/offline_mode',
    logout: '/api/peer/logout',

  };

  constructor(private sails: Sails) {
    this.user = new BehaviorSubject({});
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
  updateExternalPassword(externalPassword: boolean): Observable<SailsResponse> {
    return this.request.post(`${this.serverUrls.updateExternalPassword}`, {externalPassword});
  }
  updateEmailNotifications(subscribe: boolean): Observable<SailsResponse> {
    return this.request.post(`${this.serverUrls.updateEmailNotifications}`, {subscribe});
  }

  updateContactMethod(methods: any) {
    return this.request.post(`${this.serverUrls.updateContactMethod}`, methods);
  }

  generatKey(): Observable<SailsResponse> {
    return this.request.get(`${this.serverUrls.generateKey}`);
  }
  logOut() {
    localStorage.removeItem('COPA/JWT');
    this.user.next(null);
    // reroute to login screen.
    return this.request.post(`${this.serverUrls.logout}`, null);
  }

  editUser(key: any, value: any ) {
    this.userObject[key] = value;
    this.user.next(this.userObject);
  }

  decodeToken(): void {
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(this.getToken());
    this.user.next(decodedToken);
    this.userObject = decodedToken;
    console.log(this.userObject);
  }

  getUser(): BehaviorSubject<any> {
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
