import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-transfer-method-dialog',
  templateUrl: './transfer-method-dialog.component.html',
  styleUrls: ['./transfer-method-dialog.component.scss']
})
export class TransferMethodDialogComponent implements OnInit {
selectedMethod = 'upload';
  constructor() { }

  ngOnInit() {
  }

}
