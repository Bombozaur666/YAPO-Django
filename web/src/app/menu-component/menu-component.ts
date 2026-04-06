import {Component, EventEmitter, Output} from '@angular/core';
import {NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';
import {RouterLink} from "@angular/router";
import {TranslatePipe} from "@ngx-translate/core";
import {AuthService} from '../auth/auth-service';

@Component({
  selector: 'app-menu-component',
  imports: [
    RouterLink,
    TranslatePipe,
    NgbDropdownModule
  ],
  templateUrl: './menu-component.html',
  styleUrl: './menu-component.css'
})
export class MenuComponent {
  protected selected: string = 'login';

  @Output() newLang: EventEmitter<string> = new EventEmitter<string>();

  constructor(protected authService: AuthService) {}

  logout(): void {
    this.authService.logout();
    this.selected = 'login';
  }

  changeLanguage(lang: string): void {
    this.newLang.emit(lang);
  }
}
