import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { UsernameRequest} from '../../Interfaces/Users/user';
import {TranslatePipe} from '@ngx-translate/core';
import {AuthService} from '../auth-service';

@Component({
  selector: 'app-forgot-password',
  imports: [
    FormsModule,
    TranslatePipe,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css', '../../shared/Card.css']
})
export class ForgotPasswordComponent {
  protected forgotRequest: UsernameRequest = {} as UsernameRequest;

  constructor(private authService: AuthService) {}

  onSubmit(): void {
    this.authService.forgotPassword(this.forgotRequest).subscribe({});
  }
}
