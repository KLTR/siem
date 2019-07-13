import { ApiService } from '@services';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material';
import { environment } from '@env/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  error: string | null;
  // @Output() submitEM = new EventEmitter();
  formGroup: FormGroup;
  requiredField = 'This field is required';
  post: any = '';
  mobile = false;
  hide = true;
  isError: Observable<boolean> = null;
  errorSeparator = environment.errorSeparator;
  color = 'white';
  mode = 'determinate';
  isRegistering = false;
  value = 50;
  isRegistrationComplete = false;
  dialogConfig = new MatDialogConfig();
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public dialog: MatDialog,
    private apiService: ApiService,
    private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    // this.apiService.isRegisteredEmail('levyroy1990@gmail.com').subscribe(res => console.log(res));
    this.createForm();
    if (window.screen.width <= 480) { // 768px portrait
      this.mobile = true;
    }
    this.dialogConfig = new MatDialogConfig();
    this.dialogConfig.closeOnNavigation = true;

  }

  createForm() {
    // tslint:disable-next-line:max-line-length
    const emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.formGroup = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(emailregex)]],
      username: [null, Validators.required],
      loginPassword: [null, [Validators.required, this.checkPassword]],
      loginConfirmPassword: [null, [Validators.required, this.checkConfirmPassword]],
    });
  }

  get username() {
    return this.formGroup.get('username') as FormControl;
  }
  // validateEmailNotTaken(control: AbstractControl) {
  //   console.log(control.value);
  //   return this.apiService.searchEmail(control.value).map(res => {
  //     console.log(res);
  //     return res ? null : { emailTaken: true };
  //   });
  // }
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
  checkInUseEmail(control) {
    // mimic http database access
    const db = ['tony@gmail.com'];
    return new Observable(observer => {
      setTimeout(() => {
        this.apiService.isRegisteredEmail(control.value).subscribe(res => console.log(res));
        const result = db.indexOf(control.value) !== -1 ? { alreadyInUse: true } : null;
        observer.next(result);
        observer.complete();
      }, 1000);
    });
  }

  getErrorEmail() {
    return this.formGroup.get('email').hasError('required')
      ? 'Field is required'
      : this.formGroup.get('email').hasError('pattern')
      ? 'Not a valid email address'
      : this.formGroup.get('email').hasError('alreadyInUse')
      ? 'This email address is already in use'
      : '';
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
  onSubmit(registrationData) {
    console.log(registrationData);
    this.isRegistering = true;
    this.apiService.register(registrationData)
    .subscribe(
      (res) => {
        console.log(res);
        this.snackBar.open(`An email has been sent to ${registrationData.email}`, 'ok');
        this.error = null;
        this.isRegistering = false;
        this.isRegistrationComplete = true;
      },
      (err) => {
        console.log(err);
        this.isRegistering = false;
        err = JSON.parse(err.toString().split(this.errorSeparator)[1]).message;
        console.log(err);
        // this.snackBar.open(`Failed to Login ${err.message}`, 'ok', {
        //   duration: 3000
        // });
        this.error = err;
      }
      );
  }

  goBack() {
    this.router.navigateByUrl('login');
  }

  openPrivacyPolicy() {
    const dialogRef = this.dialog.open(PrivacyPolicyDialog, this.dialogConfig);

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(`Dialog result: ${result}`);
    // });
  }
  openTermsOfUse() {
    const dialogRef = this.dialog.open(TermsOfUseDialog, this.dialogConfig);
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(`Dialog result: ${result}`);
    // });
  }
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'privacy-policy-dialog',
  templateUrl: 'privacy-policy-dialog.html',
})
// tslint:disable-next-line:component-class-suffix
export class PrivacyPolicyDialog {}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'terms-of-use-dialog',
  templateUrl: 'terms-of-use-dialog.html',
})
// tslint:disable-next-line:component-class-suffix
export class TermsOfUseDialog {}
