import { environment } from './../../../../../environments/environment.prod';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '@app/services';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {
  formGroup: FormGroup;
  user: any;
  username: string;
  requiredField = 'This field is required';
  isSameUsername = true;
  errorSeparator = environment.errorSeparator;
  dialogConfig: MatDialogConfig;
  mobile = false;
  constructor(
    private apiSerivce: ApiService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
   ) {
     }

  ngOnInit() {
    if (window.screen.width <= 480) { // 768px portrait
      this.mobile = true;
    }
    this.user = this.apiSerivce.getUser();
    this.createForm();
  }
  createForm() {
    this.formGroup = this.formBuilder.group({
      username: [this.user.username, [Validators.required, this.checkUsername.bind(this)]],
    });
  }
  saveUsername(username) {
    this.apiSerivce.saveUsername(username).subscribe(
      (res) => {
        const body = res.getBody();
        this.apiSerivce.user.username = username;
        this.user = this.apiSerivce.getUser();
      },
      (err) => {
        err = JSON.parse(err.toString().split(this.errorSeparator)[1]).message;
        console.log(err);
        this.snackBar.open(`Ooops ... \n ${err}`, 'ok', {
          duration: 3000
        });
      }
    );
  }
  openResetPassword() {
    this.dialogConfig = new MatDialogConfig();
    if (this.mobile) {
      this.dialogConfig.height = '100vh';
      this.dialogConfig.width = '100vw';
      this.dialogConfig.maxWidth = '100vw';
      this.dialogConfig.maxHeight = '100vh';
      this.dialogConfig.position = {
        top: '0',
        left: '0'
      };
    } else {
      this.dialogConfig.height = 'fit-content';
      this.dialogConfig.width = '50vw';
      this.dialogConfig.position = {
        top: '20vh',
        left: '25%'
      };
    }
    this.dialog.open(ResetPasswordComponent, this.dialogConfig);
  }
  updateEmailNotification() {
    // this.user.emailNotify
    this.apiSerivce.updateEmailNotifications(!this.user.emailNotify).subscribe(
      () => {
        this.apiSerivce.user.emailNotify = !this.apiSerivce.user.emailNotify;
        this.user = this.apiSerivce.getUser();
      },
      (err) => {
        err = JSON.parse(err.toString().split(this.errorSeparator)[1]).message;
        console.log(err);
        this.snackBar.open(`Ooops ... \n ${err}`, 'ok', {
          duration: 3000
        });
      }
    );
  }
  checkUsername(control: FormControl): {[s: string]: boolean} {
     if (control.value === this.user.username) {
       this.isSameUsername = true;
     } else {
       this.isSameUsername = false;
     }
     return control.value === this.user.username ? { sameUsername : true} : null;
  }
  getUsernameError() {
      return this.formGroup.get('username').hasError('required')
        ? 'Field is required'
        : this.formGroup.get('username').hasError('sameUsername')
        ? 'Same username'
        : '';
  }
}
