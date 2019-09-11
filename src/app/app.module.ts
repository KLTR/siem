import {
  ConfirmDialogComponent
} from '@app/dialogs/confirm.dialog/confirm.dialog.component';
// Modules
import {
  BrowserModule
} from '@angular/platform-browser';
import {
  NgModule
} from '@angular/core';
import {
  HttpClientModule,
  HttpClient
} from '@angular/common/http';
import {
  AppComponent
} from './app.component';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import {
  BrowserAnimationsModule
} from '@angular/platform-browser/animations';
import {
  FlexLayoutModule
} from '@angular/flex-layout';
import {
  AppRoutingModule,
  MaterialModule
} from '@modules';
import {
  SailsModule,
  SailsOptions,
  SailsEnvironment
} from 'ngx-sails-socketio';
import {
  TranslateModule,
  TranslateLoader
} from '@ngx-translate/core';
import {
  TranslateHttpLoader
} from '@ngx-translate/http-loader';
import {
  environment
} from './../environments/environment';
import {
  CryappterModule
} from 'cryappter';

import {
  NgxFileDropModule
} from 'ngx-file-drop';
// Sails Options
const sailsOptions: SailsOptions = {
  url: environment.webSocketUrl,
  prefix: '',
  environment: SailsEnvironment['PROD'],
  // environment: SailsEnvironment[environment.production ? 'PROD' : 'DEV'],
  query: '__sails_io_sdk_version=0.11.0&__sails_io_sdk_platform=windows&__sails_io_sdk_language=javascript',
  reconnection: true,
  autoConnect: false,
  rejectUnauthorized: false,
  // headers: {
  //     // tslint:disable-next-line:max-line-length
  //     Authorization: localStorage.getItem("token")
  // },
  // timeout: 3000,
};
// Directives
import {
  DndDirective,
  DisableControlDirective
} from '@directives';

// Services
import {
  ApiService,
  SocketService,
  ErrorService,
  FileService,
  INTERCEPTORS
} from '@services';

// Components
import {
  WelcomeComponent,
  ForgotPasswordComponent,
  ChangePasswordComponent,
  LoginComponent,
  RegisterComponent,
  HomeComponent,
  DragAndDropComponent,
  TransfersComponent,
  UserSettingsComponent
} from '@components';
import {
  PrivacyPolicyDialog,
  TermsOfUseDialog
} from './components/register/register.component';
import {
  ResetPasswordComponent
} from './components/home/menu-items/user-settings/reset-password/reset-password.component';
import {
  AuthGuard
} from '@guards';
import {
  HistoryComponent
} from './components/home/menu-items/history/history.component';
import {
  SendPageComponent
} from './components/home/send-page/send-page.component';
import {
  FileSizePipe
} from './pipes/file-size.pipe';
import {
  ContactsDialogComponent
} from './components/home/send-page/contacts-dialog/contacts-dialog/contacts-dialog.component';
import {
  NonCopaUsersDialogComponent
} from './components/home/send-page/non-copa-users-dialog/non-copa-users-dialog.component';
import {
  MultiFactorAuthenticationDialogComponent
} from './components/home/send-page/multi-factor-authentication-dialog/multi-factor-authentication-dialog.component';
import {
  CreateLinkDialogComponent
} from './components/home/send-page/create-link-dialog/create-link-dialog.component';
import {
  TransferMethodDialogComponent
} from './components/home/send-page/transfer-method-dialog/transfer-method-dialog.component';
import { FailedDialogComponent } from './components/home/send-page/failed-dialog/failed-dialog.component';

// Translate loader with AOT
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    DndDirective,
    DisableControlDirective,
    WelcomeComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ChangePasswordComponent,
    PrivacyPolicyDialog,
    TermsOfUseDialog,
    HomeComponent,
    DragAndDropComponent,
    TransfersComponent,
    UserSettingsComponent,
    ResetPasswordComponent,
    HistoryComponent,
    ConfirmDialogComponent,
    SendPageComponent,
    FileSizePipe,
    ContactsDialogComponent,
    NonCopaUsersDialogComponent,
    MultiFactorAuthenticationDialogComponent,
    CreateLinkDialogComponent,
    TransferMethodDialogComponent,
    FailedDialogComponent,
  ],
  entryComponents: [
    PrivacyPolicyDialog,
    TermsOfUseDialog,
    TransfersComponent,
    UserSettingsComponent,
    ResetPasswordComponent,
    HistoryComponent,
    ConfirmDialogComponent,
    ContactsDialogComponent,
    NonCopaUsersDialogComponent,
    MultiFactorAuthenticationDialogComponent,
    CreateLinkDialogComponent,
    TransferMethodDialogComponent,
    FailedDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    NgxFileDropModule,
    SailsModule.forRoot(sailsOptions, INTERCEPTORS),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    CryappterModule
  ],
  providers: [ApiService, FileService, SocketService, AuthGuard, ErrorService],
  bootstrap: [AppComponent]
})
export class AppModule {}
