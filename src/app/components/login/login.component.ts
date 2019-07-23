import { ApiService } from '@services';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { environment } from '@env/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  error: string | null;
  formGroup: FormGroup;
  titleAlert = 'This field is required';
  hide = true;
  errorSeparator = environment.errorSeparator;
  isLoggingIn = false;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    ) {}

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    // tslint:disable-next-line:max-line-length
    const emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.formGroup = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(emailregex)]],
      loginPassword: [null, [Validators.required, this.checkPassword]],
    });
  }

  checkPassword(control) {
    const enteredPassword = control.value;
    const passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
    return !passwordCheck.test(enteredPassword) && enteredPassword ? { requirements: true } : null;
  }

  getErrorEmail() {
    return this.formGroup.get('email').hasError('required')
      ? 'Field is required'
      : this.formGroup.get('email').hasError('pattern')
      ? 'Not a valid email address'
      : '';
  }
  getErrorPassword() {
    return this.formGroup.get('loginPassword').hasError('required')
      ? 'Field is required (at least eight characters, one uppercase letter and one number)'
      : this.formGroup.get('loginPassword').hasError('requirements')
      ? 'Password needs to be at least eight characters, one uppercase letter and one number'
      : '';
  }

  onSubmit(credentials) {
    this.isLoggingIn = true;
    this.apiService.login(credentials)
    .subscribe(
      (res) => {
        const body = res.getBody();
        localStorage.setItem(`COPA/JWT`, `${body.token}`);
        this.error = null;
        this.apiService.decodeToken();
        this.router.navigateByUrl('home');
        this.apiService.setApp(body);
      },
      (err) => {
        this.isLoggingIn = false;
      }
      );
  }

  signUp() {
    this.router.navigateByUrl('register');
  }
  forgotPass() {
    this.router.navigate(['forgot-password', {email: this.formGroup.get('email').value}])
  }
}
