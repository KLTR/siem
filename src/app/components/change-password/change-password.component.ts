import { ErrorService } from '@services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from './../../services/api/api.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  formGroup: FormGroup;
  mobile = false;
  isResetting = false;
  hide = true;
  peerId: string;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private errorService: ErrorService) { }

  ngOnInit() {
    this.peerId = this.route.snapshot.paramMap.get('peerId')

    this.createForm();
    if (window.screen.width <= 480) { // 768px portrait
      this.mobile = true;
    }  }

  createForm() {
    // tslint:disable-next-line:max-line-length
    this.formGroup = this.formBuilder.group({
      pass: [null, [Validators.required, this.checkPassword]],
      confirmed: [null, [Validators.required, this.checkConfirmPassword]],
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
    return control.parent.controls.pass.value !== confirmPass ?  { notSame: true } : null;
  } catch {
    return '';
  }
}
getErrorPassword() {
  return this.formGroup.get('pass').hasError('required')
    ? 'Field is required (at least eight characters, one uppercase letter and one number)'
    : this.formGroup.get('pass').hasError('requirements')
    ? 'Password needs to be at least eight characters, one uppercase letter and one number'
    : '';
}
getNotSamePassword() {
  return this.formGroup.get('confirmed').hasError('notSame')
  ? 'Passwords does not match'
  : '';
}
goBack() {
  this.router.navigateByUrl('login');
}
onSubmit(formValue) {
  this.isResetting = true;
  this.apiService.resetPassword({...formValue, peerId: this.peerId}).subscribe(
    (res) => {
      this.isResetting = false;
      this.snackBar.open('password was successfuly changed.', 'ok', {
        duration: 3000
      })
      this.router.navigateByUrl('login');
    },
    (err) => {
      this.errorService.logError(err);
      this.isResetting = false;
    }
  )
  console.log(formValue);
}
}
