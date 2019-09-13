import { ApiService } from './../../../../services/api/api.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-transfers',
  templateUrl: './transfers.component.html',
  styleUrls: ['./transfers.component.scss']
})
export class TransfersComponent implements OnInit {
  incoming: any[];
  outgoing: any[];
  constructor(private apiSerivce: ApiService) {}

  ngOnInit() {
    this.setIncoming();
    this.outgoing = [];

  }

  clearAll() {
    console.log('clearing');
  }

  setIncoming(): void {
    this.incoming = [
      {
        status: 'denied',
        fileName: 'GOPRO541-003.MP4',
        message: 'Request was denied',
        from: 'Steve J.',
        date: new Date(),
        size: 123456,
        progress: 100,
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
        from: 'Steve W.',
        date: new Date(),
        size: 5322523345,
        progress: 100,

      },
      {
        status: 'new',
        fileName: 'Nintendo Files asd asd asd asd asd asd as das das das das das das ',
        message: 'Request was deniedas dasd asd asd asd asd asd asd as d',
        from: 'Steve W.',
        date: new Date(),
        size: 69302812,
        progress: 100,
      },
      {
        status: 'completed',
        fileName: 'Koze',
        message: 'Completed',
        from: 'Nina K.',
        date: new Date(),
        size: 583712,
        progress: 100,
      },
      {
        status: 'accepting',
        fileName: 'Koze',
        message: 'accepting',
        from: 'Nina K.',
        date: new Date(),
        size: 1233732,
        progress: 100,
      },
      {
        status: 'accepting',
        fileName: 'Koze',
        message: 'accepting',
        from: 'Nina K.',
        date: new Date(),
        size: 1537342,
        progress: 100,
      },
      {
        status: 'accepting',
        fileName: 'Koze',
        message: 'accepting',
        from: 'Nina K.',
        date: new Date(),
        size: 553732,
        progress: 100,
      },
    ];
  }

}
