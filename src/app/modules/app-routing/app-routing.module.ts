import { WelcomeComponent, LoginComponent, RegisterComponent, ForgotPasswordComponent, ChangePasswordComponent, HomeComponent } from '@components';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [
  { path: '', component: WelcomeComponent  },
  { path: 'home', component: HomeComponent , data: {animation: 'isRight'} },
  { path: 'login', component: LoginComponent , data: {animation: 'isRight'} },
  { path: 'register', component: RegisterComponent,  data: {animation: 'isLeft'} },
  { path: 'forgot-password', component: ForgotPasswordComponent,  data: {animation: 'isLeft'} },
  { path: 'change-password', component: ChangePasswordComponent,  data: {animation: 'isLeft'} },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
