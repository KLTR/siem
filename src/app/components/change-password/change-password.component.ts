import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  formGroup: FormGroup;
  mobile = false;
  constructor(private formBuilder: FormBuilder, private snackBar: MatSnackBar, private router: Router) { }

  ngOnInit() {
    this.createForm();
    if (window.screen.width <= 480) { // 768px portrait
      this.mobile = true;
    }  }

  createForm() {
    // tslint:disable-next-line:max-line-length
    this.formGroup = this.formBuilder.group({
      password: [null, [Validators.required, this.checkPassword]],
      confirmPassword: [null, [Validators.required, this.checkConfirmPassword]],
      validate: ''
    });
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
goBack() {
  this.router.navigateByUrl('login');
}
onSubmit(formValue) {
  console.log(formValue);
}
}
