import { PrivacyPolicyDialog, TermsOfUseDialog } from './components/register/register.component';
// Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppRoutingModule, MaterialModule } from '@modules';
import { SailsModule, SailsOptions, SailsEnvironment } from "ngx-sails-socketio";
// import { INTERCEPTORS } from "./interceptors";

const options: SailsOptions = {
  url: "https://backend-sandbox.copa.io:443",
  prefix: "",
  environment: SailsEnvironment.DEV,
  query: "__sails_io_sdk_version=0.11.0&__sails_io_sdk_platform=windows&__sails_io_sdk_language=javascript",
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
import { DndDirective } from '@directives';
// Services
import { ApiService } from '@services';
import { WelcomeComponent } from '@components';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
// Components
@NgModule({
  declarations: [
    AppComponent,
    DndDirective,
    WelcomeComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ChangePasswordComponent,
    PrivacyPolicyDialog,
    TermsOfUseDialog
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
    SailsModule.forRoot(options /*INTERCEPTORS*/)
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
