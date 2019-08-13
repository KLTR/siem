import { Directive, HostBinding, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appDnd]'
})
export class DndDirective {
  @Output() private fileUploadedEmiter: EventEmitter<File[]> = new EventEmitter();
  @Output() private folderUploadedEmiter: EventEmitter<File[]> = new EventEmitter();

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
    this.background = '#eee';
  }
  @HostListener('drop', ['$event']) public async onDrop(evt): Promise<any> {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#ffffff';


    const items = evt.dataTransfer.items;
    for (const item of items)  {
      if (item.kind === 'file') {
        const entry = item.webkitGetAsEntry();
        if (entry.isFile) {
          return this.parseFileEntry(entry);
        } else if (entry.isDirectory) {
          return this.parseDirectoryEntry(entry);
        }
      }
    }
  }
  parseFileEntry(fileEntry) {
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

   parseDirectoryEntry(directoryEntry) {
    const directoryReader = directoryEntry.createReader();
    return new Promise((resolve, reject) => {
      directoryReader.readEntries(
        entries => {
          entries.forEach(entry => {
            if (entry.isDirectory) {
              this.parseDirectoryEntry(entry);
            }
            // else{
            //   entry.file( file => {
            //     entry = file
            //   });
            //   console.log(entry);
            // }
          });
          this.folderUploadedEmiter.emit(entries)
          resolve(entries);
        },
        err => {
          reject(err);
        }
      );
    });
  }
}
