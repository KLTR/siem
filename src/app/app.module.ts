import { PrivacyPolicyDialog } from './components/register/register.component';
// Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppRoutingModule, MaterialModule } from '@modules';

// Directives
import { DndDirective } from '@directives';
// Services
import { WebSocketService } from '@services';
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
    PrivacyPolicyDialog
  ],
  entryComponents: [PrivacyPolicyDialog],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
  ],
  providers: [WebSocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
