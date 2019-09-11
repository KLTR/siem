import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { ErrorService } from '@services';
import {
  environment
} from './../../../../../environments/environment.prod';
import {
  MatDialog,
  MatDialogConfig
} from '@angular/material/dialog';
import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import {
  ApiService
} from '@app/services';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';
import {
  MatSnackBar, MatSelectChange
} from '@angular/material';
import {
  ResetPasswordComponent
} from './reset-password/reset-password.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;
  userSubscription: any
  appSubscription: any;
  user: any;
  username: string;
  requiredField = 'This field is required';
  isSameUsername = true;
  errorSeparator = environment.errorSeparator;
  dialogConfig: MatDialogConfig;
  mobile = false;
  connectionMethods = [];
  app: any;
  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private errorService: ErrorService
  ) {}

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
    this.appSubscription.unsubscribe();
  }

  ngOnInit() {
    this.userSubscription = this.apiService.user.asObservable().subscribe(user => {
      this.user = user
    });
    this.appSubscription = this.apiService.app.asObservable().pipe(
      distinctUntilChanged())
      .subscribe(app => {
        this.app = app;
      })
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
        this.snackBar.open(` ${!this.user.emailNotify ? 'Unsubscribed successfuly' : 'Subscribed successfuly'}`, 'ok', {
          duration: 3000
        })
      },
      (err) => {
        this.errorService.logError(err);
      }
    );
  }

  updateContactMethod() {
    console.log(this.user.contactByUsername)
    if (!this.user.contactByKey && !this.user.contactByEmail && !this.user.contactByUsername) {
      this.snackBar.open('you must select atleast one connection method. setting back to Email ..', 'Ok', {
        duration: 3000
      })
      this.apiService.updateContactMethod({
        contactByKey: false,
        contactByEmail: true,
        contactByUsername: false
      }).subscribe(
        () => {
          this.apiService.editUser('contactByKey', false);
          this.apiService.editUser('contactByEmail', true);
          this.apiService.editUser('contactByUsername', false);
          return;
        },
        (err) => {
          this.errorService.logError(err);
          return;
        }
      );
      return;
    } else {
      this.apiService.updateContactMethod({
        contactByKey: this.user.contactByKey,
        contactByEmail: this.user.contactByEmail,
        contactByUsername: this.user.contactByUsername
      }).subscribe(
        () => {
          this.apiService.editUser('contactByKey', this.user.contactByKey);
          this.apiService.editUser('contactByEmail', this.user.contactByEmail);
          this.apiService.editUser('contactByUsername', this.user.contactByUsername);
          this.snackBar.open('Changes have been successfuly saved.', 'Ok', {
            duration: 3000
          })
        },
        (err) => {
          this.errorService.logError(err);
        }
      );
    }
  }
  updateExternalPassword() {
    this.apiService.updateExternalPassword(!this.user.externalPassword).subscribe(
      (res) => {
        this.apiService.editUser('externalPassword', !this.user.externalPassword);
        this.snackBar.open('Changes have been successfuly saved.', 'Ok', {
          duration: 3000
        })
      },
      (err) => {
          this.errorService.logError(err);
      }
    );
  }
  updateProtectedLinkPasword() {
    this.apiService.updateProtectedLinkPassword(!this.user.protectedLinkPass).subscribe(
      (res) => {
        this.apiService.editUser('protectedLinkPass', !this.user.protectedLinkPass);
        this.snackBar.open('Changes have been successfuly saved.', 'Ok', {
          duration: 3000
        })

      },
      (err) => {
          this.errorService.logError(err);
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
        this.snackBar.open('Changes have been successfuly saved.', 'Ok', {
          duration: 3000
        })

      },
      (err) => {
        this.errorService.logError(err);
      }
    );
  }

  logout() {
    this.apiService.logout().subscribe(
      () => {
        this.snackBar.open('You are now logged out.', 'Ok', {
          duration: 3000
        })

      },
      (err) => {
        this.errorService.logError(err);
      }
    );
  }

  generateKey() {
    const oldPass = this.user.password;
    this.user.password = null;
    this.apiService.generatKey().subscribe(
      (res) => {
        this.apiService.editUser('password', res.getBody().password);
        this.snackBar.open('Key was successfuly generated.', 'Ok', {
          duration: 3000
        })
      },
      (err) => {
        this.errorService.logError(err);
        this.user.password = oldPass;
      }
    );
  }
  checkUsername(control: FormControl): {
    [s: string]: boolean
  } {
    if (control.value === this.user.username) {
      this.isSameUsername = true;
    } else {
      this.isSameUsername = false;
    }
    return control.value === this.user.username ? {
      sameUsername: true
    } : null;
  }
  getUsernameError() {
    return this.formGroup.get('username').hasError('required') ?
      'Field is required' :
      this.formGroup.get('username').hasError('sameUsername') ?
      'Same username' :
      '';
  }
  selectDownloadLinkLimit(event: MatSelectChange) {
    this.apiService.setDownloadLinkLimitDefault(event.value).subscribe(
      (res) => {
        // this.apiService.editUser('downloadLinkLimit', event.value);
      },
      (err) => {
        this.errorService.logError(err);
      }
    )
  }

  copyToClipboard(val: string){
    let selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = val;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
      this.snackBar.open('Copied to clipboard.', 'Ok', {duration: 3000 })
    }
}
