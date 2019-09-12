import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { environment } from '@env/environment';

@Component({
  selector: 'app-create-link-dialog',
  templateUrl: './create-link-dialog.component.html',
  styleUrls: ['./create-link-dialog.component.scss']
})
export class CreateLinkDialogComponent implements OnInit {
  formGroup: FormGroup;
  password: any;
  constructor(
    private formBuilder: FormBuilder,

  ) { }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      password: [null, [Validators.required, this.checkPassword]],
    });
  }
  checkPassword(control) {
    const enteredPassword = control.value;
    return !environment.passwordCheck.test(enteredPassword) && enteredPassword ? { requirements: true } : null;
  }
}
