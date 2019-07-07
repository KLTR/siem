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

// Sails Options
const sailsOptions: SailsOptions = {
  url: 'https://backend-sandbox.copa.io:443',
  prefix: '',
  environment: SailsEnvironment.DEV,
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
import { ApiService, INTERCEPTORS} from '@services';

// Components
import {
  WelcomeComponent,
  ForgotPasswordComponent,
  ChangePasswordComponent,
  LoginComponent,
  RegisterComponent,
} from '@components';
import { PrivacyPolicyDialog, TermsOfUseDialog } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { DragAndDropComponent } from './components/home/drag-and-drop/drag-and-drop.component';

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
  ],
  entryComponents: [PrivacyPolicyDialog, TermsOfUseDialog],
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
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
