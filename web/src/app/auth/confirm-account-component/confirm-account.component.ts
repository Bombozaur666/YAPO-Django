import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../auth-service';
import Swal from 'sweetalert2';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {colors} from '../../shared/setup/colors';

@Component({
  selector: 'app-login-component',
  imports: [
    TranslatePipe
  ],
  templateUrl: './confirm-account.component.html',
  styleUrls: ['./confirm-account.component.css', '../../shared/Card.css']
})
export class ConfirmAccountComponent implements OnInit {
  protected initialized: boolean = false;
  confirm_token: string | null = null;
  constructor(private site: ActivatedRoute,
              private router: Router,
              private authService: AuthService,
              private translate: TranslateService) {}

  ngOnInit(): void {
    this.confirm_token = this.site.snapshot.queryParamMap.get('token');

    if (this.confirm_token) {
      this.authService.confirmAccount(this.confirm_token).subscribe({
        next: (): void => {
          this.initialized = true;
          this.translate.get([
            'alerts.confirmAccount.successTitle',
            'alerts.confirmAccount.successText',
            'alerts.confirmAccount.ok',
          ]).subscribe(translations => {
            Swal.fire({
              title: translations['alerts.confirmAccount.successTitle'],
              text: translations['alerts.confirmAccount.successText'],
              icon: "success",
              confirmButtonText: translations['alerts.confirmAccount.ok'],
              confirmButtonColor: colors["action-button"],
              background: colors["main-secondary-color"],
            }).then((result): void => {
              if (result.isConfirmed) {
                this.router.navigate(['/login']);
              }
            });
          });
        },
        error: (): void => {
          this.initialized = true;

          this.translate.get([
            'alerts.confirmAccount.failureTitle',
            'alerts.confirmAccount.failureText',
            'alerts.confirmAccount.ok',
          ]).subscribe(translations => {
            Swal.fire({
              title: translations['alerts.confirmAccount.failureTitle'],
              text: translations['alerts.confirmAccount.failureText'],
              icon: "error",
              confirmButtonText: translations['alerts.confirmAccount.ok'],
              confirmButtonColor: colors["action-button"],
              background: colors["main-secondary-color"],
            }).then((result): void => {
              if (result.isConfirmed) {
                this.router.navigate(['/register']);
              }
            });
          });
        }
      })

    } else {
      this.initialized = true;
      this.translate.get([
        'alerts.confirmAccount.failureTitle',
        'alerts.confirmAccount.failureTextToken',
        'alerts.confirmAccount.ok',
      ]).subscribe(translations => {
        Swal.fire({
          title: translations['alerts.confirmAccount.failureTitle'],
          text: translations['alerts.confirmAccount.failureTextToken'],
          icon: "error",
          confirmButtonText: translations['alerts.confirmAccount.ok'],
          confirmButtonColor: colors["action-button"],
          background: colors["main-secondary-color"],
        }).then((result): void => {
            if (result.isConfirmed) {
              this.router.navigate(['/login']);
            }
          });
      });
    }
  }
}
