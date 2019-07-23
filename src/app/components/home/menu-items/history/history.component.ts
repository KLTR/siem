import { ErrorService } from '@services';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '@app/services';
import { MatDialog, MatTableDataSource, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  displayedColumns: string[] = ['createdAt', 'filename', 'sender', 'fileSize', 'status'];
  incoming: [] = [];
  outgoing: [] = [];
  history:[] = [];
  isLoadingResults = true;

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private errorService: ErrorService
    ) { }

  ngOnInit() {

    this.getHistory();
  }

  getHistory() {
    this.apiService.getHistory('incoming').subscribe(
      (res) => {
        this.incoming =(res.getBody().data.records)
        console.log(this.incoming)
        this.isLoadingResults = false;
      },
      (err) => {
       this.errorService.logError(err);
      }
    );
  }

}
export interface Incoming {
  createdAt: string;
  filename: number;
  sender: string;
  fileSize: number;
  status: string
}
