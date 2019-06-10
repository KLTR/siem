import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'copa';
  path = '../assets/svg-icons';
  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
    this.matIconRegistry.addSvgIcon(`email`, this.domSanitizer.bypassSecurityTrustResourceUrl(`${this.path}/email.svg`));
    this.matIconRegistry.addSvgIcon(`done`, this.domSanitizer.bypassSecurityTrustResourceUrl(`${this.path}/done.svg`));
    this.matIconRegistry.addSvgIcon(`done_all`, this.domSanitizer.bypassSecurityTrustResourceUrl(`${this.path}/done_all.svg`));
    this.matIconRegistry.addSvgIcon(`favorite_empty`, this.domSanitizer.bypassSecurityTrustResourceUrl(`${this.path}/favorite_empty.svg`));
    this.matIconRegistry.addSvgIcon(`favorite_full`, this.domSanitizer.bypassSecurityTrustResourceUrl(`${this.path}/favorite_full.svg`));
    this.matIconRegistry.addSvgIcon(`attach_file`, this.domSanitizer.bypassSecurityTrustResourceUrl(`${this.path}/attach_file.svg`));
    this.matIconRegistry.addSvgIcon(`send`, this.domSanitizer.bypassSecurityTrustResourceUrl(`${this.path}/send.svg`));
    this.matIconRegistry.addSvgIcon(`settings`, this.domSanitizer.bypassSecurityTrustResourceUrl(`${this.path}/settings.svg`));
    this.matIconRegistry.addSvgIcon(`error`, this.domSanitizer.bypassSecurityTrustResourceUrl(`${this.path}/error.svg`));
    this.matIconRegistry.addSvgIcon(`upload`, this.domSanitizer.bypassSecurityTrustResourceUrl(`${this.path}/upload.svg`));
    this.matIconRegistry.addSvgIcon(`arrow_back`, this.domSanitizer.bypassSecurityTrustResourceUrl(`${this.path}/arrow_back.svg`));

  }
}
