import { Injectable } from '@angular/core';
import { SailsModel, Sails, SailsQuery, RequestCriteria, SailsRequest, SailsResponse,
         SailsSubscription, SailsEvent } from 'ngx-sails-socketio';
import { map, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

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
    isRegisteredUsername: '/api/auth/valid_username',
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
    updateSelfEncryption: '/api/peer/update/self_encryption',
    logout: '/api/peer/logout',

  };

  constructor(private sails: Sails, private router: Router, private dialog: MatDialog) {
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

  forgotPassword(email: {email: string}): Observable<SailsResponse> {
    return this.request.post(`${this.serverUrls.forgotPassword}`, email);
  }

  updateExternalPassword(externalPassword: boolean): Observable<SailsResponse> {
    return this.request.post(`${this.serverUrls.updateExternalPassword}`, {externalPassword});
  }
  updateEmailNotifications(subscribe: boolean): Observable<SailsResponse> {
    return this.request.post(`${this.serverUrls.updateEmailNotifications}`, {subscribe});
  }

  updateProtectedLinkPassword(protectedLinkPass: boolean): Observable<SailsResponse> {
    return this.request.post(`${this.serverUrls.updateProtectedLinkPassword}`, {protectedLinkPass});
  }

  updateOfflineMode(offlineMode: 'ask' | 'upload' | 'wait'): Observable<SailsResponse> {
    return this.request.post(`${this.serverUrls.updateOfflineMode}`, {offlineMode});
  }

  updateContactMethod(methods: any): Observable<SailsResponse> {
    return this.request.post(`${this.serverUrls.updateContactMethod}`, methods);
  }
  updateSelfEncryption() {
    console.log('need to implement..');
  }
  generatKey(): Observable<SailsResponse> {
    return this.request.get(`${this.serverUrls.generateKey}`);
  }
  logout(): Observable<SailsResponse> {
    this.dialog.closeAll();
    localStorage.removeItem('COPA/JWT');
    // reroute to login screen.
    this.router.navigateByUrl('login');
    this.user.next(null);
    return this.request.post(`${this.serverUrls.logout}`, {});
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

  isRegisteredEmail(email: string): Observable<SailsResponse> {
    return this.request.get(`${this.serverUrls.isRegisteredEmail}`, {email});
  }

  isRegisteredUsername(username: string): Observable<SailsResponse> {
    console.log(username);
    return this.request.get(`${this.serverUrls.isRegisteredUsername}`, {username});
  }
}
