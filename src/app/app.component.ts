import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterOutlet, Router } from '@angular/router';
import { fader, slider, stepper, transformer } from './animations/route-animations';
import { Sails, SailsListener } from 'ngx-sails-socketio';
import { ApiService, SocketService, ErrorService } from '@services';
import {TranslateService} from '@ngx-translate/core';
import { transition, trigger, query, style, group, animate } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('routeAnimations', [
      transition('* => isLeft', [
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%'
          })
        ], { optional: true }),
        query(':enter', [
          style({ left: '-100%'})
        ]),
        group([
          query(':leave', [
            animate('600ms ease', style({ left: '100%'}))
          ], { optional: true }),
          query(':enter', [
            animate('600ms ease', style({ left: '0%'}))
          ])
        ]),
      ]),
      transition('* => isRight', [
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100%'
          })
        ], { optional: true }),
        query(':enter', [
          style({ right: '-100%'})
        ]),
        group([
          query(':leave', [
            animate('600ms ease', style({ right: '100%'}))
          ], { optional: true }),
          query(':enter', [
            animate('600ms ease', style({ right: '0%'}))
          ])
        ]),
      ]),
      transition('isRight => *', [
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100%'
          })
        ], { optional: true }),
        query(':enter', [
          style({ left: '-100%'})
        ]),
        group([
          query(':leave', [
            animate('600ms ease', style({ left: '100%'}))
          ], { optional: true }),
          query(':enter', [
            animate('600ms ease', style({ left: '0%'}))
          ])
        ]),
      ]),
      transition('isLeft => *', [
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100%'
          })
        ], { optional: true }),
        query(':enter', [
          style({ right: '-100%'})
        ]),
        group([
          query(':leave', [
            animate('600ms ease', style({ right: '100%'}))
          ], { optional: true }),
          query(':enter', [
            animate('600ms ease', style({ right: '0%'}))
          ])
        ]),
      ])
    ],
    )
  ],
})

export class AppComponent {
  title = 'copa';
  path = '../assets/svg-icons';
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    public sails: Sails,
    private apiService: ApiService,
    public translate: TranslateService,
    public socketService: SocketService,
    public router: Router,
    public errorService: ErrorService
    ) {
    // this.matIconRegistry.addSvgIcon(`email`, this.domSanitizer.bypassSecurityTrustResourceUrl(`${this.path}/email.svg`));
    // this.matIconRegistry.addSvgIcon(`done`, this.domSanitizer.bypassSecurityTrustResourceUrl(`${this.path}/done.svg`));
    // this.matIconRegistry.addSvgIcon(`done_all`, this.domSanitizer.bypassSecurityTrustResourceUrl(`${this.path}/done_all.svg`));
    // this.matIconRegistry.addSvgIcon(`favorite_full`, this.domSanitizer.bypassSecurityTrustResourceUrl(`${this.path}/favorite_full.svg`));
    // this.matIconRegistry.addSvgIcon(`attach_file`, this.domSanitizer.bypassSecurityTrustResourceUrl(`${this.path}/attach_file.svg`));
    // this.matIconRegistry.addSvgIcon(`send`, this.domSanitizer.bypassSecurityTrustResourceUrl(`${this.path}/send.svg`));
    // this.matIconRegistry.addSvgIcon(`settings`, this.domSanitizer.bypassSecurityTrustResourceUrl(`${this.path}/settings.svg`));
    // this.matIconRegistry.addSvgIcon(`error`, this.domSanitizer.bypassSecurityTrustResourceUrl(`${this.path}/error.svg`));
    // this.matIconRegistry.addSvgIcon(`upload`, this.domSanitizer.bypassSecurityTrustResourceUrl(`${this.path}/upload.svg`));
    // this.matIconRegistry.addSvgIcon(`arrow_back`, this.domSanitizer.bypassSecurityTrustResourceUrl(`${this.path}/arrow_back.svg`));
    // this.matIconRegistry.addSvgIcon(`transfer`, this.domSanitizer.bypassSecurityTrustResourceUrl(`${this.path}/transfer.svg`));
    // this.matIconRegistry.addSvgIcon(`history`, this.domSanitizer.bypassSecurityTrustResourceUrl(`${this.path}/history.svg`));
    // this.matIconRegistry.addSvgIcon(`group`, this.domSanitizer.bypassSecurityTrustResourceUrl(`${this.path}/group.svg`));
    // this.matIconRegistry.addSvgIcon(`eye`, this.domSanitizer.bypassSecurityTrustResourceUrl(`${this.path}/eye.svg`));
    // this.matIconRegistry.addSvgIcon(`chat_bubble`, this.domSanitizer.bypassSecurityTrustResourceUrl(`${this.path}/chat_bubble.svg`));


    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');

    sails.addEventListener(SailsListener.CONNECTING, data => {
      console.log('CONNECTING...');
    });

    sails.addEventListener(SailsListener.RECONNECTING, data => {
    });

    sails.addEventListener(SailsListener.RECONNECT, data => {
      console.log('RECONNECT...');
    });

    sails.addEventListener(SailsListener.DISCONNECT, data => {
      console.log('DISCONNECT...');
    });

    sails.addEventListener(SailsListener.CONNECT, data => {
      console.log('CONNECTED!!!');
      // this.apiService.getSocketInfo();
    });
    sails.connect();

    this.apiService.authMe().subscribe(
      (res) => {
        console.log(res);
        const token = res.getBody().token;
        this.apiService.setToken(token);
      },
      (err) => {
        this.errorService.logError(err);
        this.router.navigateByUrl('login');
      }
    );

  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  useLanguage(language: string) {
    this.translate.use(language);
}
}
