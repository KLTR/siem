import { ApiService } from '../api/api.service';
import { Injectable } from '@angular/core';
import { SailsSubscription, SailsEvent, Sails } from 'ngx-sails-socketio';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket: SailsSubscription;
  constructor(
    private sails: Sails,
    private apiSerivce: ApiService,
    private router: Router) {
    this.socket = new SailsSubscription(this.sails);
    this.socket.on('pendingPeer').subscribe( event => {
      const res: any = event.getData();
      console.log(res);
      console.log(res.eventName);
      if (res.eventName === 'verifedPendingPeer') {
        this.apiSerivce.setToken(res.token);
        this.router.navigateByUrl('home');
      }
    });
   }
}
