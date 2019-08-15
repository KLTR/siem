import {
  Directive,
  HostBinding,
  HostListener,
  Output,
  EventEmitter
} from '@angular/core';

@Directive({
  selector: '[appDnd]'
})
export class DndDirective {
  @Output() private fileUploadedEmitter: EventEmitter < File[] > = new EventEmitter();
  @Output() private folderUploadedEmitter: EventEmitter < File[] > = new EventEmitter();
  @Output() private updateFolderSizeEmitter: EventEmitter < number > = new EventEmitter();

  @HostBinding('style.background') private background = '#ffffff';

  constructor() {}

  @HostListener('dragover', ['$event']) public onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#999';
  }
  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#ffffff';
  }
  @HostListener('drop', ['$event']) public onDrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#ffffff';


    const items = evt.dataTransfer.items;
    console.log(evt.dataTransfer.files);
    for (const item of items) {
      if (item.kind === 'file') {
        console.log(item);
        const entry = item.webkitGetAsEntry();
        if (entry.isFile) {
          const fileList = evt.dataTransfer.files;
          this.fileUploadedEmitter.emit(fileList);
          return
          // return this.parseFileEntry(entry);
        } else if (entry.isDirectory) {
          console.log(item.getAsFile());
          this.folderUploadedEmitter.emit([item.getAsFile()])
          this.parseDirectoryEntry(entry).then((entries: any[]) => {
            let size = 0;
            entries.forEach(entry => {
              entry.getMetadata( metaData => {
                size += metaData.size;
                console.log(size);
                this.updateFolderSizeEmitter.emit(size);
              })
            })
            console.log(size);
          });
        }
      }
    }
  }
  async parseFileEntry(fileEntry) {
    return new Promise((resolve, reject) => {
      fileEntry.file(
        file => {
          this.fileUploadedEmitter.emit([file]);
          resolve(file);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  addMetaData(entries): Promise<any>{
    return new Promise((resolve, reject) => {
     entries.forEach(entry => {
      entry.getMetadata(res => {
        entry.size = res.size;
      },
      err => {
        reject(err);
      });
    });
    resolve(entries);
    })
  }


  parseDirectoryEntry(directoryEntry) {
    const directoryReader = directoryEntry.createReader();
    return new Promise((resolve, reject) => {
      directoryReader.readEntries(
         entries => {
          for(let entry of entries) {
            if (entry.isDirectory) {
               this.parseDirectoryEntry(entry);
            }
            else {
               entry.getMetadata(res => {
                entry.size = res.size
              })
            }
          }
          resolve(entries);
        },
      );
    });
  }
}
