import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {LoginRequest} from '../../Interfaces/Users/user';
import {TranslatePipe} from '@ngx-translate/core';
import {AuthService} from '../auth-service';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-login-component',
  imports: [
    FormsModule,
    TranslatePipe,
    RouterLink
  ],
  templateUrl: './login-component.html',
  styleUrls: ['./login-component.css', '../../shared/Card.css']
})
export class LoginComponent{
  protected loginRequest: LoginRequest = {username: '', password: ''};

  constructor(private authService: AuthService) {}

  onSubmit(): void {
    this.authService.login(this.loginRequest);
  }
}
