import {
  ErrorService
} from '@services';
import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import {
  ApiService
} from '@app/services';
import {
  MatDialog,
  MatDialogConfig
} from '@angular/material/dialog';
import {
  ConfirmDialogComponent
} from '@app/dialogs/confirm.dialog/confirm.dialog.component';
import {
  MatSnackBar
} from '@angular/material';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HistoryComponent implements OnInit {
  sideNavOpened = false;
  tabs = ['Incoming', 'Outgoing'];
  selectedIndexTab = 0;
  displayedColumns: string[] = ['createdAt', 'filename', 'sender', 'fileSize', 'status'];
  incoming: any[] = [];
  outgoing: [] = [];
  history: [] = [];
  isLoadingResults = true;
  isMobile = false;
  dialogData = {
    title: 'Delete History',
    questionText: 'Are you sure you want to delete',
    btn: 'Delete',
    btnColor: 'warn'
  }
  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private errorService: ErrorService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getIncoming();
    this.getOutgoing();
    if (window.screen.width <= 480) { // 768px portrait
      this.isMobile = true;
    }
  }

  getIncoming() {
    this.apiService.getHistory('incoming').subscribe(
      (res) => {
        this.incoming = res.getBody().data.records;
        this.isLoadingResults = false;
      },
      (err) => {
        this.errorService.logError(err);
      }
    );
  }

  getOutgoing() {
    this.apiService.getHistory('outgoing').subscribe(
      (res) => {
        this.outgoing = res.getBody().data.records;
        this.isLoadingResults = false;
      },
      (err) => {
        this.errorService.logError(err);
      }
    );
  }

  delete(itemId: string, type: string, fileName ? : string) {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        ...this.dialogData,
        name: `"${fileName}"`
      }
    }).afterClosed().subscribe(dialogRes => {
      if (dialogRes) {
        this.apiService.deleteHistory(itemId, type).subscribe(
          () => {
            this.incoming = this.incoming.filter(item => item.id !== itemId);
          },
          (err) => {
            this.errorService.logError(err);
          }
        );
      }
    });
  }

  deleteAll() {
    const type = this.tabs[this.selectedIndexTab];
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        ...this.dialogData,
        name: `"${type}"`
      }
    }).afterClosed().subscribe(dialogRes => {
      if (dialogRes) {
        this.apiService.deleteAllHistory(type).subscribe(
          () => {
            if (type === 'Incoming') {
              this.incoming = [];
            } else if (type === 'Outgoing') {
              this.outgoing = [];
            }

          },
          (err) => {
            this.errorService.logError(err);
          }
        )
      }
    });
  }

  sendLink(approvalId) {
    this.apiService.sendLink(approvalId).subscribe(
      () => {
        this.snackBar.open('Link was re-sent.', 'Ok', {
          duration: 3000
        })
      },
      (err) => {
        this.errorService.logError(err);
      }
    )
  }

  copyToClipboard(val: string) {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.snackBar.open('Copied to clipboard.', 'Ok', {
      duration: 3000
    })
  }
}
export interface Incoming {
  createdAt: string;
  filename: number;
  sender: string;
  fileSize: number;
  status: string
}
