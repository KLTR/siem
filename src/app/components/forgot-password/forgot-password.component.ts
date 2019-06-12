import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  formGroup: FormGroup;
  mobile = false;
  submitted = false;
  constructor(private formBuilder: FormBuilder, private snackBar: MatSnackBar, private router: Router) { }

  ngOnInit() {
    this.createForm();
    if (window.screen.width <= 480) { // 768px portrait
      this.mobile = true;
    }
  }
  createForm() {
    // tslint:disable-next-line:max-line-length
    const emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.formGroup = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(emailregex)]],
      validate: ''
    });
  }
  getErrorEmail() {
    return this.formGroup.get('email').hasError('required')
      ? 'Field is required'
      : this.formGroup.get('email').hasError('pattern')
      ? 'Not a valid email address'
      : '';
  }
  onSubmit() {
  this.snackBar.open('Reset confirmation was sent to your email.', 'ok', {
    duration: 3000
  });
  console.log(this.formGroup.get('email').value);
  this.submitted = true;
  }
  goBack() {
    this.router.navigateByUrl('login');
  }
}
