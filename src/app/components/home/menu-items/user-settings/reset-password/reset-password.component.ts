import { ActivatedRoute } from '@angular/router';
import { ErrorService } from '@services';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material';
import { ApiService } from '@app/services';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '@env/environment';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  hide = true;
  formGroup: FormGroup;
  authenticated = false;
  isAuthenticating = false;
  isSaving = false;
  peerId: string;
  errorSeparator = environment.errorSeparator;
  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private errorService: ErrorService) { }

  ngOnInit() {
    this.createForm();
    this.peerId = this.route.snapshot.paramMap.get('peerId');
    console.log(this.peerId);

  }
  createForm() {
    // tslint:disable-next-line:max-line-length
    this.formGroup = this.formBuilder.group({
      loginPassword: [null, [Validators.required, this.checkPassword]],
      loginConfirmPassword: [null, [Validators.required, this.checkConfirmPassword]],
    });
  }

  authenticatePassword() {
    this.isAuthenticating = true;
    this.apiService.authPassword(this.formGroup.get('loginPassword').value).subscribe(
      (res) => {
        console.log(res);
        this.authenticated = true;
        this.formGroup.get('loginPassword').reset();
        this.hide = true;
      },
      (err) => {
        this.errorService.logError(err);
        this.isAuthenticating = false;
        this.authenticated = false;
      }
    );
  }
  savePassword() {
    this.isSaving = true;
    const pass = this.formGroup.get('loginPassword').value;
    const confirmed = this.formGroup.get('loginConfirmPassword').value;

    this.apiService.resetPasswordWithPeerId({pass, confirmed}).subscribe(
      (res) => {
        console.log(res);
        this.snackBar.open(`New password was succesfully saved :)`, 'ok', {
          duration: 3000
        });
        this.dialog.closeAll();
      },
      (err) => {
        this.isSaving = false;
        this.errorService.logError(err);
      }
     );
  }
  checkPassword(control) {
    const enteredPassword = control.value;
    const passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
    return !passwordCheck.test(enteredPassword) && enteredPassword ? { requirements: true } : null;
  }
checkConfirmPassword(control) {
  const confirmPass = control.value;
  try {
    return control.parent.controls.loginPassword.value !== confirmPass ?  { notSame: true } : null;
  } catch {
    return '';
  }
}
getErrorPassword() {
  return this.formGroup.get('loginPassword').hasError('required')
    ? 'Field is required (at least eight characters, one uppercase letter and one number)'
    : this.formGroup.get('loginPassword').hasError('requirements')
    ? 'Password needs to be at least eight characters, one uppercase letter and one number'
    : '';
}

getNotSamePassword() {
  return this.formGroup.get('loginConfirmPassword').hasError('notSame')
  ? 'Passwords does not match'
  : '';
}
}
