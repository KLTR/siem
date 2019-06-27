import { Injectable } from '@angular/core';
import { SailsModel, Sails, SailsQuery, RequestCriteria, SailsRequest, SailsResponse, SailsSubscription } from 'ngx-sails-socketio';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  req: SailsRequest;
  serverUrls = {
    getSocketInfo: '/api/socketinfo',
    login: '/api/auth/login',
    register: '/api/auth/register',
  };
  constructor(private sails: Sails) {
    this.req = new SailsRequest(this.sails);
  }


  getSocketInfo() {
    this.req.get(`${this.serverUrls.getSocketInfo}`).subscribe((res) => {
      console.log(res.getBody());
    });
  }

  login(credentials): Observable<SailsResponse> {
    return this.req.post(`${this.serverUrls.login}`, credentials);
  }

  register(credentials): Observable<SailsResponse> {
    return this.req.post(`${this.serverUrls.register}`, credentials);
  }
}
