import { MatDialogConfig } from '@angular/material/dialog';
import { CreateLinkDialogComponent } from './../create-link-dialog/create-link-dialog.component';
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
  settingsConfig = new MatDialogConfig();
  mobile = false;
  downloadLinkLimitString = '5 downloads';
  note: string;
  selectedMethod: 'upload';
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
    if (window.screen.width <= 480) { // 768px portrait
      this.mobile = true;
    }
        this.settingsConfig.autoFocus = false;
        if(!this.mobile){
          this.settingsConfig.width = '30vw';
        } else {
          this.settingsConfig.width = '40vw';
        }
    this.setContacts();
  }
  setDownloadLinkLimit(contact: any, limit: string) {
    contact.downloadLinkLimit = limit;
  }

  toggleLink(contact: any){
    if(!contact.isLinkOnly){
      this.dialog.open(CreateLinkDialogComponent, this.settingsConfig).afterClosed().subscribe( res => {
        if(res){
          contact.isLinkOnly = true;
          contact.password = res;
        }
      })
    } else {
      contact.isLinkOnly = false;
      contact.password = '';
    }
  }


  setContacts(){
    this.data.forEach(contact => {
      contact = {...contact, isLinkOnly : false, downloadLinkLimit: 'Unlimited downloads (for 7 days)', note: '', password: ''}
    });
  }
}
