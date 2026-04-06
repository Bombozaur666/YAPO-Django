import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {RegisterRequest} from '../../Interfaces/Users/user';
import {AuthService} from '../auth-service';
import Swal from 'sweetalert2';
import {colors} from '../../shared/setup/colors';

@Component({
  selector: 'app-register-component',
  imports: [
    FormsModule,
    TranslatePipe
  ],
  templateUrl: './register-component.html',
  styleUrls: ['./register-component.css', '../../shared/Card.css']
})
export class RegisterComponent {
  protected registerForm: RegisterRequest = {username: '', password: '', email: ''};

  constructor(private authService: AuthService,
              private translate: TranslateService) {}

  onSubmit(): void {
    this.authService.register(this.registerForm).subscribe({
      next: (): void => {
        this.translate.get([
          'alerts.register.successTitle',
          'alerts.register.successText',
          'alerts.register.ok',
        ]).subscribe(translations => {
          Swal.fire({
            title: translations['alerts.register.successTitle'],
            text: translations['alerts.register.successText'],
            icon: "success",
            confirmButtonText: translations['alerts.register.ok'],
            confirmButtonColor: colors['action-button'],
            background: colors['main-secondary-color'],
          })
        });
      },
      error: (): void => {
        this.translate.get([
          'alerts.register.failureTitle',
          'alerts.register.failureText',
          'alerts.register.ok',
        ]).subscribe(translations => {
          Swal.fire({
            title: translations['alerts.register.failureTitle'],
            text: translations['alerts.register.failureText'],
            icon: "error",
            confirmButtonText: translations['alerts.register.ok'],
            confirmButtonColor: colors['action-button'],
            background: colors['main-secondary-color'],
          })
        });
      }
    });
  }
}
