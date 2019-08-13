import {
  MatDialogConfig
} from '@angular/material/dialog';
import {
  Component,
  OnInit,
} from '@angular/core';
import {
  MatDialog
} from '@angular/material';

@Component({
  selector: 'app-drag-and-drop',
  templateUrl: './drag-and-drop.component.html',
  styleUrls: ['./drag-and-drop.component.scss']
})
export class DragAndDropComponent implements OnInit {
  uploadPaths = [];
  isMobile = false;
  dialogConfig: MatDialogConfig;
  isFilesSelected = false;
  selectedFiles;
  constructor(private dialog: MatDialog) {
  }

  ngOnInit() {
    if (window.screen.width <= 480) { // 768px portrait
      this.isMobile = true;
    }
    this.dialogConfig = new MatDialogConfig();
    this.dialogConfig.autoFocus = false;
    this.dialogConfig.backdropClass = 'backdrop-hide';
    this.dialogConfig.hasBackdrop = true;

  }

  uploadFile(file) {
    this.isFilesSelected = true;
    this.selectedFiles = Array.from(file);

  }

  uploadFolder(files, isDragged?) {
      Array.prototype.forEach.call(files, file => {
        console.log(file);
        console.log(files);
        this.uploadPaths.push(file.webkitRelativePath);
      });
      console.log(this.uploadPaths);
      this.selectedFiles = Array.from(files);
      this.isFilesSelected = true;

  }
  cancel(e) {
    this.isFilesSelected = false;
  }

}
