import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';
@Component({
  selector: 'app-send-page',
  templateUrl: './send-page.component.html',
  styleUrls: ['./send-page.component.scss']
})
export class SendPageComponent implements OnInit {
  @Output() cancel = new EventEmitter();
  @Input() selectedFiles: any[];
  selectedTransferMethod = 'classic'
  formGroup: FormGroup;
    constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    console.log(this.selectedFiles);
    this.createForm()

  }
  createForm() {
    this.formGroup = this.formBuilder.group({
      username: ['', [Validators.required]],
    });
  }
delete(name: string){
  this.selectedFiles = this.selectedFiles.filter( (f: File) => f.name !== name);
  if(this.selectedFiles.length === 0){
    this.cancel.emit(true);
  }
}
uploadFile(file) {
  this.selectedFiles.push(...file);
  console.log(this.selectedFiles);
}

uploadFolder(files) {
  console.log(files);
  // this.uploadPaths = [];
  Array.prototype.forEach.call(files, file => {
    // this.uploadPaths.push(file.webkitRelativePath);
  });
  this.selectedFiles.push(...files);
}
}
