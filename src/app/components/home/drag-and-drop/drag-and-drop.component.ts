import { FileService } from './../../../services/file/file.service';
import {
  MatDialogConfig
} from '@angular/material/dialog';
import {
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import {
  MatDialog
} from '@angular/material';

@Component({
  selector: 'app-drag-and-drop',
  templateUrl: './drag-and-drop.component.html',
  styleUrls: ['./drag-and-drop.component.scss']
})
export class DragAndDropComponent implements OnInit, OnDestroy {
  uploadPaths = [];
  isMobile = false;
  dialogConfig: MatDialogConfig;
  isFilesSelected = false;
  selectedFiles = [];
  constructor(private dialog: MatDialog, public fileService: FileService) {
    this.fileService.filesSubject$.subscribe(files => {
      console.log(files);
      if(files) {
        this.selectedFiles.push(files);
        if(this.selectedFiles.length > 0) {
          this.isFilesSelected = true;
        } else {
          this.isFilesSelected = false;
        }
      }else {
        this.isFilesSelected = false;
        this.selectedFiles = [];
      }
    });
  }
ngOnDestroy(): void {
  //Called once, before the instance is destroyed.
  //Add 'implements OnDestroy' to the class.
  console.log('destroy');
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
    // this.selectedFiles = Array.from(file);
    
    console.log(file);
    // this.fileService.setSubject(file);
    this.selectedFiles = Array.from(file);
    this.isFilesSelected = true;

  }

  uploadFolder(files) {
    this.selectedFiles = Array.from(files);
    this.isFilesSelected = true;

  }
  cancel(e) {
    this.isFilesSelected = false;
  }


}
