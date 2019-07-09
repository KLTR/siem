import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-drag-and-drop',
  templateUrl: './drag-and-drop.component.html',
  styleUrls: ['./drag-and-drop.component.scss']
})
export class DragAndDropComponent implements OnInit {
  uploadPaths = [];
  constructor() { }

  ngOnInit() {
  }

  uploadFile(files) {
    console.log(files);
  }

  uploadFolder(files) {
    console.log(files);
    this.uploadPaths = [];
    Array.prototype.forEach.call(files, file => {
      this.uploadPaths.push(file.webkitRelativePath);
    });
  }
}
