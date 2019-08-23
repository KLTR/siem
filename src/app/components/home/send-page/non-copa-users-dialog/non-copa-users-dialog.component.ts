import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-non-copa-users-dialog',
  templateUrl: './non-copa-users-dialog.component.html',
  styleUrls: ['./non-copa-users-dialog.component.scss']
})
export class NonCopaUsersDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit() {
  }

}
