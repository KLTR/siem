import { Injectable } from '@angular/core';
import { SailsModel, Sails, SailsQuery, RequestCriteria, SailsRequest, SailsResponse, SailsSubscription } from "ngx-sails-socketio";
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  req: SailsRequest;
  constructor(private sails: Sails) {
    // this.req = new SailsRequest(this.sails);
  }

  // getSocketInfo() {
  //   const req = new SailsRequest(this.sails);
  //   req.get('/api/socketinfo').pipe(map((response: SailsResponse) => {
  //           console.log(response);
  //       }));
  // }
  getSocketInfo() {
    const req = new SailsRequest(this.sails);
    req.get('/api/socketinfo').subscribe((res) => {
      console.log(req)
      console.log(res)
    });
  }
}
