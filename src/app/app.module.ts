import { ConfirmDialogComponent } from '@app/dialogs/confirm.dialog/confirm.dialog.component';
// Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppRoutingModule, MaterialModule } from '@modules';
import { SailsModule, SailsOptions, SailsEnvironment } from 'ngx-sails-socketio';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from './../environments/environment';

// Sails Options
const sailsOptions: SailsOptions = {
  url: environment.webSocketUrl,
  prefix: '',
  environment: SailsEnvironment[environment.production ? 'PROD' : 'DEV'],
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
import { DndDirective, UniqueEmailValidatorDirective } from '@directives';

// Services
import { ApiService, SocketService, ErrorService, INTERCEPTORS} from '@services';

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
import { PrivacyPolicyDialog, TermsOfUseDialog } from './components/register/register.component';
import { ResetPasswordComponent } from './components/home/menu-items/user-settings/reset-password/reset-password.component';
import { AuthGuard } from '@guards';
import { HistoryComponent } from './components/home/menu-items/history/history.component';

// Translate loader with AOT
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    DndDirective,
    UniqueEmailValidatorDirective,
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
  ],
  entryComponents: [
    PrivacyPolicyDialog,
    TermsOfUseDialog,
    TransfersComponent,
    UserSettingsComponent,
    ResetPasswordComponent,
    HistoryComponent,
    ConfirmDialogComponent
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
    SailsModule.forRoot(sailsOptions, INTERCEPTORS),
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient]
      }
  })
  ],
  providers: [ApiService, SocketService, AuthGuard, ErrorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
