import {Component, OnInit, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {
  TranslateService,
  TranslateModule,
} from "@ngx-translate/core";
import {Title} from "@angular/platform-browser";
import {CookieService} from 'ngx-cookie-service';
import {MenuComponent} from './menu-component/menu-component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TranslateModule, MenuComponent],
  providers: [CookieService],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('Yapo');
  constructor(private translate: TranslateService,
              private titleService:Title) {
    this.translate.addLangs(['pl', 'en']);
    this.translate.setFallbackLang('pl');
    this.translate.use('pl');
    this.translate.get(["app.title.full"]).subscribe(
      translations => {this.titleService.setTitle(translations['app.title.full']);
      });
  }

  ngOnInit() {
    this.translate.onLangChange.subscribe(() => {
      this.translate.get(["app.title.full"]).subscribe(translations => {
        this.titleService.setTitle(translations['app.title.full']);
      });
    });
  }

  changeLanguage(language: string): void {
    this.translate.use(language);
  }
}
