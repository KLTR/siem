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
        size: '25MB',
        progress: 100,
      },
      {
        status: 'aborted',
        fileName: 'Nintendo Files',
        message: 'Request was denied',
        from: 'Steve W.',
        date: new Date(),
        size: '25MB',
        progress: 100,

      },
      {
        status: 'new',
        fileName: 'Nintendo Files',
        message: 'Request was denied',
        from: 'Steve W.',
        date: new Date(),
        size: '25MB',
        progress: 100,
      },
      {
        status: 'completed',
        fileName: 'Koze',
        message: 'Completed',
        from: 'Nina K.',
        date: new Date(),
        size: '25MB',
        progress: 100,
      },
      {
        status: 'accepting',
        fileName: 'Koze',
        message: 'accepting',
        from: 'Nina K.',
        date: new Date(),
        size: '21MB',
        progress: 100,
      },
    ];
  }

}
