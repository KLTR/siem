import { distinctUntilChanged, debounceTime, catchError, map, tap } from 'rxjs/operators';
import { ApiService, ErrorService } from '@services';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Observable, of } from 'rxjs';
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
    private snackBar: MatSnackBar,
    private errorService: ErrorService) {
  }

  ngOnInit() {
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
      email: [null,
      [Validators.required, Validators.pattern(emailregex)],
      [this.checkInUseEmail.bind(this)]],
      username: [null,
      [Validators.required],
      [this.checkInUseUsername.bind(this)]],
      loginPassword: [null, [Validators.required, this.checkPassword]],
      loginConfirmPassword: [null, [Validators.required, this.checkConfirmPassword]],
    });
  }

  get username() {
    return this.formGroup.get('username') as FormControl;
  }
  checkPassword(control) {
    const enteredPassword = control.value;
    return !environment.passwordCheck.test(enteredPassword) && enteredPassword ? { requirements: true } : null;
  }
checkConfirmPassword(control) {
  const confirmPass = control.value;
  try {
    return control.parent.controls.loginPassword.value !== confirmPass ?  { notSame: true } : null;
  } catch {
    return '';
  }
}

  checkInUseUsername(control: FormControl) {
    if(!control.errors){
     return  this.apiService.isRegisteredUsername(control.value)
      .pipe(
        distinctUntilChanged(),
        debounceTime(3000),
        map(res => {
          if(res.getBody().exist) {
            return {alreadyInUse: true};
          } else{
            return null;
          }
        }),
        catchError(error => {
          return of(null)
        })
      )
  }else {
    return of(null)
  }
  }
  checkInUseEmail(control: FormControl) {
        if(!control.errors){
         return  this.apiService.isRegisteredEmail(control.value)
          .pipe(
            map(res => {
              if(res.getBody().registered) {
                return {alreadyInUse: true};
              } else{
                return null;
              }
            }),
            catchError(error => of(null))
          )
      }else {
        return of(null)
      }
  }


  getErrorUsername(){
    return this.formGroup.get('username').hasError('required')
      ? 'Field is required'
      : this.formGroup.get('username').hasError('alreadyInUse')
      ? 'This username is already in use'
      : '';
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
    this.isRegistering = true;
    console.log(registrationData)
    this.apiService.register(registrationData)
    .subscribe(
      (res) => {
        this.snackBar.open(`An email has been sent to ${registrationData.email}`, 'ok', {
          duration: 3000
        });
        this.error = null;
        this.isRegistering = false;
        this.isRegistrationComplete = true;
      },
      (err) => {
        this.isRegistering = false;
        this.errorService.logError(err);
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
