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
  @Output() private fileUploadedEmiter: EventEmitter < File[] > = new EventEmitter();
  @Output() private folderUploadedEmiter: EventEmitter < File[] > = new EventEmitter();

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
    for (const item of items) {
      console.log(item)
      if (item.kind === 'file') {
        const entry = item.webkitGetAsEntry();
        if (entry.isFile) {
          this.parseFileEntry(entry);
        } else if (entry.isDirectory) {
          this.parseDirectoryEntry(entry).then((entries: any[]) => {
            this.addMetaData(entries).then( res => {
              console.log(res)
              this.folderUploadedEmiter.emit(res);
            })
          });
        }
      }
    }
  }
  async parseFileEntry(fileEntry) {
    return new Promise((resolve, reject) => {
      fileEntry.file(
        file => {
          this.fileUploadedEmiter.emit([file]);
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
          entries.forEach(entry => {
            if (entry.isDirectory) {
              this.parseDirectoryEntry(entry);
            }
            // else {
            //   entry.getMetadata(res => {
            //     entry.size = res.size
            //   })
            // }
          });
          resolve(entries);
        },
        err => {
          reject(err);
        }
      );
    });
  }
}
