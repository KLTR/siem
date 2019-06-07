import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appDnd]'
})
export class DndDirective {
  @HostBinding('style.background') private background = '#eee';

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
  @HostListener('drop', ['$event']) public onDrop(evt): Promise<any> {
    evt.preventDefault();
    evt.stopPropagation();

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
          console.log(file);
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
          console.log(entries);
          entries.forEach(entry => {
            console.log(entry);
            if (entry.isDirectory) {
              this.parseDirectoryEntry(entry);
            }
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
