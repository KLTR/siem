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
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
   ) {
    this.apiService.user.subscribe(user => {
      this.user = user;
    });
     }

  ngOnInit() {
    if (window.screen.width <= 480) { // 768px portrait
      this.mobile = true;
    }
    this.createForm();
  }
  createForm() {
    this.formGroup = this.formBuilder.group({
      username: [this.user.username, [Validators.required, this.checkUsername.bind(this)]],
    });
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
      this.dialogConfig.closeOnNavigation = true;
    }
    this.dialog.open(ResetPasswordComponent, this.dialogConfig);
  }
  updateEmailNotification() {
    // this.user.emailNotify
    this.apiService.updateEmailNotifications(!this.user.emailNotify).subscribe(
      () => {
        this.apiService.editUser('emailNotify', !this.user.emailNotify);
      },
      (err) => {
        this.logError(err);
      }
    );
  }

  logError(err) {
    err = JSON.parse(err.toString().split(this.errorSeparator)[1]).message;
    console.log(err);
    this.snackBar.open(`Ooops ... \n ${err}`, 'ok', {
      duration: 3000
    });
  }
  saveUsername(username: string) {
    this.apiService.saveUsername(username).subscribe(
      () => {
        this.apiService.editUser('username', username);
      },
      (err) => {
        this.logError(err);
      }
    );
  }
  updateContactMethod() {
    this.apiService.updateContactMethod({
      contactByKey: this.user.contactByKey,
      contactByEmail: this.user.contactByEmail,
      contactByUsername: this.user.contactByUsername}
    ).subscribe(
      () => {
        this.apiService.editUser('contactByKey', this.user.contactByKey);
        this.apiService.editUser('contactByEmail', this.user.contactByEmail);
        this.apiService.editUser('contactByUsername', this.user.contactByUsername);
      },
      (err) => {
       this.logError(err);
      }
    );
  }
  updateExternalPassword() {
    this.apiService.updateExternalPassword(!this.user.externalPassword).subscribe(
      (res) => {
        this.apiService.editUser('externalPassword', !this.user.externalPassword);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  updateProtectedLinkPasword() {
    this.apiService.updateProtectedLinkPassword(!this.user.protectedLinkPass).subscribe(
      (res) => {
        this.apiService.editUser('protectedLinkPass', !this.user.protectedLinkPass);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  updateSelfEncryption() {
    this.apiService.updateSelfEncryption();
    // this.apiService.updateSelfEncryption(!this.user.selfEncryption).subscribe(
    //   (res) => {
    //     this.apiService.editUser('protectedLinkPass', !this.user.selfEncryption);
    //   },
    //   (err) => {
    //     console.log(err);
    //   }
    // );
  }
  updateOfflineMode() {
    this.apiService.updateOfflineMode(this.user.offlineMode).subscribe(
      (res) => {
        this.apiService.editUser('offlineMode', this.user.offlineMode);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  logout() {
    this.apiService.logout().subscribe(
      () => {
        console.log('logged out');
      },
      (err) => {
        this.logError(err);
      }
    );
  }

  generateKey() {
    const oldPass = this.user.password;
    this.user.password = null;
    this.apiService.generatKey().subscribe(
        (res) => {
          this.apiService.editUser('password', res.getBody().password);
        },
        (err) => {
          // this.logError(err);
          console.log(err);
          this.logError(err);
          this.user.password = oldPass;
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
