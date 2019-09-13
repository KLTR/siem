import {
  ApiService
} from './../../../../services/api/api.service';
import {
  Component,
  OnInit,
  ViewEncapsulation,
  Inject
} from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog
} from '@angular/material';


@Component({
  selector: 'app-transfers',
  templateUrl: './transfers.component.html',
  styleUrls: ['./transfers.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TransfersComponent implements OnInit {
  incoming: any[];
  outgoing: any[];
  constructor(
    private apiSerivce: ApiService,
    public dialog: MatDialog) {}

  ngOnInit() {
    this.setIncoming();
    this.outgoing = [];

  }

  acceptIncoming(incomingTransfer) {
    if (incomingTransfer.needKey) {
      const dialogRef = this.dialog.open(SetSessionKeyDialogComponent, {
          height: '400px',
          width: '600px',
        data: {
          incomingTransfer
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        console.log(result);
      });
    }
  }

  clearAll() {
    console.log('clearing');
  }

  setIncoming(): void {
    this.incoming = [{
        status: 'denied',
        fileName: 'GOPRO541-003.MP4',
        message: 'Request was denied',
        from: 'Steve J.',
        date: new Date(),
        size: 123456,
        progress: 8,
      },
      {
        status: 'aborted',
        fileName: 'Nintendo Files',
        message: 'Request was denied',
        from: 'Steve W.',
        date: new Date(),
        size: 2352041,
        progress: 100,

      },
      {
        status: 'failed',
        fileName: 'Nintendo Files',
        message: 'Request was denied',
        from: 'hotmailsux62@gmail.com.',
        date: new Date(),
        size: 5322523345,
        progress: 94,

      },
      {
        status: 'new',
        fileName: 'Nintendo Files asd asd asd asd asd asd as das das das das das das ',
        message: 'Request was deniedas dasd asd asd asd asd asd asd as d',
        from: 'Steve W.',
        date: new Date(),
        size: 69302812,
        progress: 22,
      },
      {
        status: 'completed',
        fileName: 'MY first image.jpg',
        message: 'Completed',
        from: 'Nina K.',
        date: new Date(),
        size: 583712,
        progress: 14,
      },
      {
        status: 'accepting',
        fileName: 'World tour - China',
        message: 'accepting',
        from: 'Nina K.',
        date: new Date(),
        size: 1233732,
        progress: 26,
      },
      {
        status: 'accepting',
        fileName: 'Important docs.doc',
        message: 'accepting',
        from: 'Nina K.',
        date: new Date(),
        size: 1537342,
        progress: 75,
        needKey: true
      },
      {
        status: 'accepting',
        fileName: 'Koze',
        message: 'accepting',
        from: 'Nina K.',
        date: new Date(),
        size: 553732,
        progress: 66,
      },
    ];
  }

}

@Component({
  selector: 'set-seesion-key.component',
  templateUrl: 'set-seesion-key.component.html',
})
export class SetSessionKeyDialogComponent {

  constructor(
    public dialogRef: MatDialogRef < SetSessionKeyDialogComponent > ,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
