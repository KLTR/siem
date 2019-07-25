import { ApiService } from '@services';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TransfersComponent } from './menu-items/transfers/transfers.component';
import { UserSettingsComponent } from './menu-items/user-settings/user-settings.component';
import { HistoryComponent } from './menu-items/history/history.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
   dialogConfig: MatDialogConfig;
   mobileDialogConfig: MatDialogConfig;
   mobile = false;
   user: any;
  constructor(private dialog: MatDialog, private apiService: ApiService) {
    this.apiService.user.subscribe(user => {
      this.user = user;
    });


   }

  ngOnInit() {
    this.setDialogs();
    if (window.screen.width <= 480) { // 768px portrait
      this.mobile = true;
    }
  }
  openTransfers() {
    if(this.mobile){
      this.dialog.open(TransfersComponent, this.mobileDialogConfig);
    } else {
    this.dialog.open(TransfersComponent, this.dialogConfig);
    }
  }
  openSettings() {
    const settingsConfig = new MatDialogConfig();

    if (this.mobile) {
      settingsConfig.height = '100vh';
      settingsConfig.width = '100vw';
      settingsConfig.position = {
        top: '0',
        left: '0'
      };
      this.dialog.open(UserSettingsComponent, this.mobileDialogConfig);
    } else {
      settingsConfig.minWidth = '500px';
      settingsConfig.maxWidth = '650px';
      this.dialog.open(UserSettingsComponent, settingsConfig);
    }
  }
  setDialogs() {
    this.dialogConfig = new MatDialogConfig();
    this.dialogConfig.maxWidth = '100vw';
    this.dialogConfig.maxHeight = '100vh';
    this.dialogConfig.height = '50vh';
    this.dialogConfig.width = '50vw';
    this.dialogConfig.hasBackdrop = true;
    this.dialogConfig.autoFocus = false;
    this.dialogConfig.closeOnNavigation  = true;

    this.mobileDialogConfig = new MatDialogConfig;{
      this.mobileDialogConfig.height = '100vh';
      this.mobileDialogConfig.width = '100vw';
      this.mobileDialogConfig.maxHeight = '100vh';
      this.mobileDialogConfig.maxWidth = '100vw';
      this.mobileDialogConfig.autoFocus = false;
      this.mobileDialogConfig.position = {
        top: '0',
        left: '0'
      }
    }
  }
  openHistory() {

    if(this.mobile){
      this.dialog.open(HistoryComponent, this.mobileDialogConfig);
    } else {
      const historyConfig = new MatDialogConfig();
      historyConfig.height = '100vh';
      historyConfig.width = '100vw';
      historyConfig.maxWidth = '100vw';
      historyConfig.maxHeight = '100vh';
      historyConfig.position = {
        top: '0',
        left: '0'
    }
    this.dialog.open(HistoryComponent, historyConfig);
    }
  }

   openContacts() {
  }
}
