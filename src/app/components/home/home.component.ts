import { ApiService } from '@services';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TransfersComponent } from './menu-items/transfers/transfers.component';
import { UserSettingsComponent } from './menu-items/user-settings/user-settings.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
   dialogConfig: MatDialogConfig;
   mobile = false;
  constructor(private dialog: MatDialog, private apiService: ApiService) {
     this.dialogConfig = new MatDialogConfig();
     this.dialogConfig.position = {
       top: '10vh',
       left: '5%',
     };
     this.dialogConfig.maxWidth = '100vw';
     this.dialogConfig.maxHeight = '100vh';
     this.dialogConfig.height = '70vh';
     this.dialogConfig.width = '90vw';
     this.dialogConfig.autoFocus = true;
     this.dialogConfig.hasBackdrop = true;
     this.dialogConfig.autoFocus = false;
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
    // this.dialogConfig.backdropClass = 'backdrop-hide';
    const settingsConfig = new MatDialogConfig();
    settingsConfig.autoFocus = true;
    settingsConfig.hasBackdrop = true;
    settingsConfig.autoFocus = false;
    settingsConfig.maxWidth = '100vw';
    settingsConfig.maxHeight = '100vh';
    settingsConfig.backdropClass = 'backdrop-hide';
    if (this.mobile) {
      settingsConfig.height = '100vh';
      settingsConfig.width = '100vw';
      settingsConfig.position = {
        top: '0',
        left: '0'
      };
    } else {
      settingsConfig.height = 'fit-content';
      settingsConfig.width = '50vw';
      settingsConfig.position = {
        top: '20vh',
        left: '25%'
      };
    }
    this.dialog.open(UserSettingsComponent, settingsConfig);
  }
  // openPrivacyPolicy() {
  //   const dialogRef = this.dialog.open(PrivacyPolicyDialog);

  //   // dialogRef.afterClosed().subscribe(result => {
  //   //   console.log(`Dialog result: ${result}`);
  //   // });
  // }

}
