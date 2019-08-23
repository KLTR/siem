import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { ApiService } from '@app/services';

@Component({
  selector: 'app-multi-factor-authentication-dialog',
  templateUrl: './multi-factor-authentication-dialog.component.html',
  styleUrls: ['./multi-factor-authentication-dialog.component.scss']
})
export class MultiFactorAuthenticationDialogComponent implements OnInit {
  user: any;
  downloadLinkLimitString = '5 downloads';
  isContactsReady = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private dialog: MatDialog,
    private apiService: ApiService,
    ) {
    this.apiService.user.subscribe(user => {
      this.user = user;
    });
   }

  ngOnInit() {
    this.setContacts();
  }
  setDownloadLinkLimit(contact: any, limit: string) {
    contact.downloadLinkLimit = limit;
  }

  toggleLink(contact: any){
   contact.isLinkOnly = !contact.isLinkOnly;
  }

  setContacts(){
    this.data.forEach(contact => {
      contact = {...contact, isLinkOnly : false, downloadLinkLimit: 'Unlimited downloads (for 7 days)'}
      console.log(contact);
    });
    this.isContactsReady = true;
  }
}
