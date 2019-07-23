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
   mobile = false;
   user: any;
  constructor(private dialog: MatDialog, private apiService: ApiService) {
    this.apiService.user.subscribe(user => {
      this.user = user;
    });
     this.dialogConfig = new MatDialogConfig();
     this.dialogConfig.position = {
       top: '10vh',
       left: '5%',
     };
     this.dialogConfig.maxWidth = '100vw';
     this.dialogConfig.maxHeight = '100vh';
     this.dialogConfig.height = '70vh';
     this.dialogConfig.width = '90vw';
     this.dialogConfig.hasBackdrop = true;
     this.dialogConfig.autoFocus = false;
     this.dialogConfig.closeOnNavigation  = true;
   }

  ngOnInit() {
    if (window.screen.width <= 480) { // 768px portrait
      this.mobile = true;
    }
  }
  openTransfers() {
    this.dialog.open(TransfersComponent, this.dialogConfig);
  }
  openSettings() {
    const settingsConfig = new MatDialogConfig();
    settingsConfig.minWidth = '500px';
    settingsConfig.maxWidth = '650px';
    if (this.mobile) {
      settingsConfig.height = '100vh';
      settingsConfig.width = '100vw';
      settingsConfig.maxWidth = '50vw';
      settingsConfig.position = {
        top: '0',
        left: '0'
      };
    }
    this.dialog.open(UserSettingsComponent, settingsConfig);
  }

  openHistory() {
    const historyConfig = new MatDialogConfig();
    historyConfig.maxWidth = '100vw';
    if (this.mobile) {
      historyConfig.height = '100vh';
      historyConfig.width = '100vw';
      historyConfig.maxWidth = '50vw';
      historyConfig.position = {
        top: '0',
        left: '0'
      };
    }
    this.dialog.open(HistoryComponent, historyConfig);
  }
}
