import { ApiService } from '../api/api.service';
import { Injectable } from '@angular/core';
import { SailsSubscription, SailsEvent, Sails } from 'ngx-sails-socketio';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket: SailsSubscription;
  constructor(
    private sails: Sails,
    private apiSerivce: ApiService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.socket = new SailsSubscription(this.sails);
    this.socket.on('pendingPeer').subscribe(event => {
      const res: any = event.getData();
      if (res.eventName === 'verifedPendingPeer') {
        this.apiSerivce.setToken(res.token);
        this.router.navigateByUrl('home');
      }
    });
    this.socket.on('go_to_reset').subscribe((event: any) => {
      const peerId = event.JWR.peerId
      this.snackBar.open('Your password was successfuly rested.', 'ok', {
        duration: 3000
      })
      this.router.navigate(['change-password', { peerId }])
    });
    this.socket.on('alive').subscribe((event: any) => {
      // its even okey to fire acknowledge without "if (event.hasAck())" it is only a option i have added for future usage
      if (event.hasAck()) {
        event.acknowledge({
          alive: true
        });
      }
    });
  }
}
