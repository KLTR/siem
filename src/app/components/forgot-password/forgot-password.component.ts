import { ApiService } from './../../services/api/api.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  formGroup: FormGroup;
  mobile = false;
  submitted = false;
  email: string;
  isResetting: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService
    ) { }

  ngOnInit() {
    // this.email = this.route.snapshot.params
   this.email = this.route.snapshot.paramMap.get('email')
   if(this.email === 'null') {
     this.email = '';
   }
    this.createForm();
    if (window.screen.width <= 480) { // 768px portrait
      this.mobile = true;
    }
  }
  createForm() {
    // tslint:disable-next-line:max-line-length
    const emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.formGroup = this.formBuilder.group({
      email: [this.email,
      [Validators.required, Validators.pattern(emailregex)],
      [this.checkInUseEmail.bind(this)]],
    });
  }
  getErrorEmail() {
    return this.formGroup.get('email').hasError('required')
      ? 'Field is required'
      : this.formGroup.get('email').hasError('pattern')
      ? 'Not a valid email address'
      : this.formGroup.get('email').hasError('notExist')
      ? 'This email address does not exist'
      : '';
  }
  onSubmit(email) {
    this.isResetting = true;
    console.log(email);
    this.apiService.forgotPassword(email)
    .subscribe(
      (res) => {
        console.log(res);
        this.snackBar.open('Reset confirmation was sent to your email.', 'ok', {
          duration: 3000
        });
        this.submitted = true;
      },
      (err) => {
        this.isResetting = false;
      }
    );
  }
  goBack() {
    this.router.navigateByUrl('login');
  }

  checkInUseEmail(control: FormControl) {
    if(!control.errors){
      console.log(control.errors);
     return  this.apiService.isRegisteredEmail(control.value)
      .pipe(
        map(res => {
          console.log(res);
          if(!res.getBody().registered) {
            return {notExist: true};
          } else{
            return null;
          }
        }),
        catchError(error => null)
      )
  }else {
    return of(null)
  }
}
}
