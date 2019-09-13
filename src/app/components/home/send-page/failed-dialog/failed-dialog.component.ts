import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-failed-dialog',
  templateUrl: './failed-dialog.component.html',
  styleUrls: ['./failed-dialog.component.scss']
})
export class FailedDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data) {}

  ngOnInit() {
  }

}
