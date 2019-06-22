import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  error: string | null;
  // @Output() submitEM = new EventEmitter();
  formGroup: FormGroup;
  titleAlert = 'This field is required';
  post: any = '';
  mobile = false;
  hide = false;

  constructor(private formBuilder: FormBuilder, private router: Router, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.createForm();
    if (window.screen.width <= 480) { // 768px portrait
      this.mobile = true;
    }  }

  createForm() {
    // tslint:disable-next-line:max-line-length
    const emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.formGroup = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(emailregex)], this.checkInUseEmail],
      username: [null, Validators.required],
      password: [null, [Validators.required, this.checkPassword]],
      confirmPassword: [null, [Validators.required, this.checkConfirmPassword]],
      validate: ''
    });
  }

  get username() {
    return this.formGroup.get('username') as FormControl;
  }

  checkPassword(control) {
    const enteredPassword = control.value;
    const passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
    return !passwordCheck.test(enteredPassword) && enteredPassword ? { requirements: true } : null;
  }
checkConfirmPassword(control) {
  const confirmPass = control.value;
  try {
    return control.parent.controls.password.value !== confirmPass ?  { notSame: true } : null;
  } catch {
    return '';
  }
}
  checkInUseEmail(control) {
    // mimic http database access
    const db = ['tony@gmail.com'];
    return new Observable(observer => {
      setTimeout(() => {
        const result = db.indexOf(control.value) !== -1 ? { alreadyInUse: true } : null;
        observer.next(result);
        observer.complete();
      }, 4000);
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
    return this.formGroup.get('password').hasError('required')
      ? 'Field is required (at least eight characters, one uppercase letter and one number)'
      : this.formGroup.get('password').hasError('requirements')
      ? 'Password needs to be at least eight characters, one uppercase letter and one number'
      : '';
  }

  getNotSamePassword() {
    return this.formGroup.get('confirmPassword').hasError('notSame')
    ? 'Passwords does not match'
    : '';
  }
  onSubmit(post) {
    this.post = post;
    console.log(this.post);
  }

  signUp() {
    this.router.navigateByUrl('register');
  }
  goBack() {
    this.router.navigateByUrl('login');
  }

  openPrivacyPolicy() {
    const dialogRef = this.dialog.open(PrivacyPolicyDialog);

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(`Dialog result: ${result}`);
    // });
  }
  openTermsOfUse() {
    const dialogRef = this.dialog.open(TermsOfUseDialog);
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
