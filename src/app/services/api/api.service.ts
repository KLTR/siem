import { Injectable } from '@angular/core';
import { SailsModel, Sails, SailsQuery, RequestCriteria, SailsRequest, SailsResponse, SailsSubscription } from 'ngx-sails-socketio';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { SailsIOClient } from 'ngx-sails-socketio/dist/sails.io.client';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  request: SailsRequest;
  serverUrls = {
    getSocketInfo: '/api/socketinfo',
    login: '/api/auth/login',
    register: '/api/auth/register',
    getMe: '/api/auth/me',
  };
  constructor(private sails: Sails) {
    this.request = new SailsRequest(this.sails);
  }
  getToken(): any {
    const token = localStorage.getItem('Token');
    return token;
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

  getMe(): Observable<SailsResponse> {
    return this.request.get(`${this.serverUrls.getMe}`, );
  }
}
