import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TransfersComponent, UserSettingsComponent } from '..';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
   dialogConfig: MatDialogConfig;
  constructor(private dialog: MatDialog) {
     this.dialogConfig = new MatDialogConfig();
     this.dialogConfig.position = {
       top: '10vh',
       left: '5%',
     };
     this.dialogConfig.maxWidth = '100vw';
     this.dialogConfig.height = '70vh';
     this.dialogConfig.width = '90vw';
     this.dialogConfig.autoFocus = true;
     this.dialogConfig.hasBackdrop = true;
     this.dialogConfig.autoFocus = false;
   }

  ngOnInit() {
  }
  openTransfers() {
    this.dialog.open(TransfersComponent, this.dialogConfig);
  }
  openSettings() {
    // this.dialogConfig.backdropClass = 'backdrop-hide';
    this.dialog.open(UserSettingsComponent, this.dialogConfig);
  }
  // openPrivacyPolicy() {
  //   const dialogRef = this.dialog.open(PrivacyPolicyDialog);

  //   // dialogRef.afterClosed().subscribe(result => {
  //   //   console.log(`Dialog result: ${result}`);
  //   // });
  // }

}
