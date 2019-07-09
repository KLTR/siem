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
    this.incoming = [];
    this.outgoing = [];
  }

}
