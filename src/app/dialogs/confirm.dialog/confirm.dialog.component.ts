import { ApiService } from './../../services/api/api.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-confirm.dialog',
  templateUrl: './confirm.dialog.component.html',
  styleUrls: ['./confirm.dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

// title Delete History / Add Contact
// questionText - Are you sure you want to delete/add ..
// name - filename, username
// btn - example : Delete, Confirm
constructor(
  @Inject(MAT_DIALOG_DATA) public data: any,
  private apiService: ApiService)
  {

  }

  ngOnInit() {
  }

}
