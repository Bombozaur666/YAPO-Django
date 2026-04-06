import {Routes} from '@angular/router';
import {HomeComponent} from './home-component/home-component';
import {LoginComponent} from './auth/login-component/login-component';
import {ProfileComponent} from './auth/profile-component/profile-component';
import {RegisterComponent} from './auth/register-component/register-component';
import {authGuard} from './auth/auth-guard';
import {PlantsCollectionComponent} from './plants-collection-component/plants-collection-component';
import {ForgotPasswordComponent} from './auth/forgot-password-component/forgot-password.component';
import {ConfirmAccountComponent} from './auth/confirm-account-component/confirm-account.component';
import {SharePlantComponent} from './share-component/share-plant-component/share-plant.component';


export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'share/plant', component: SharePlantComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'collection', component: PlantsCollectionComponent, canActivate: [authGuard] },
  { path: 'confirm-account', component: ConfirmAccountComponent },
  { path: '**', redirectTo: '' }
];
