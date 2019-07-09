import { Component, OnInit } from '@angular/core';
import { ApiService } from '@app/services';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {
  formGroup: FormGroup;
  email: string;
  user: any;
  constructor(
    private apiSerivce: ApiService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.user = this.apiSerivce.getUser();
    this.email = this.user.email;
    console.log(this.email);
    this.createForm();
  }
  createForm() {
    // tslint:disable-next-line:max-line-length
    // const emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.formGroup = this.formBuilder.group({
      email: [this.email],
      username: [null],
      loginPassword: [null]
    });
  }
}
