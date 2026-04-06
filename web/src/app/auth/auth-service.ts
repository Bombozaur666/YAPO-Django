import {Injectable, Injector} from '@angular/core';
import {LoginRequest, RegisterRequest, User, UsernameRequest} from '../Interfaces/Users/user';
import {HttpClient} from '@angular/common/http';
import {catchError, map, Observable, of, tap} from 'rxjs';
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';
import {JWT_TOKEN, REFRESH_TOKEN, TokenResponse} from '../Interfaces/Users/token';
import {TranslateService} from '@ngx-translate/core';
import Swal from 'sweetalert2';
import {host} from '../shared/setup/host';
import {colors} from '../shared/setup/colors';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authenticated: boolean = false;
  private  user: User = {} as User;
  protected baseUrl: string = `${host.protocol}${host.hostname}:${host.port}/user/`;

  constructor(private httpClient: HttpClient,
              private cookieService: CookieService,
              private router: Router,
              private injector: Injector) {}

  private get translate(): TranslateService {
    return this.injector.get(TranslateService);
  }

  get token(): string | null {
    return this.cookieService.get(JWT_TOKEN);
  }

  get path(): string {
    return `${this.baseUrl}avatar`;
  }

  setUser(user: User) {
    this.user = user;
  }

  get getUer(): User {
    return this.user;
  }

  get isAuthenticated(): boolean {
    return this.authenticated;
  }

  userProfile(): Observable<User> {
    return this.httpClient.get<User>(this.baseUrl);
  }

  login(loginRequest: LoginRequest): void{
    this.httpClient.post<TokenResponse>(`${this.baseUrl}login`, loginRequest, {
      headers: {'Content-Type': 'application/json'},
      withCredentials: true
    }
    ).subscribe({
      next: (data: TokenResponse): void => {

        this.cookieService.set(JWT_TOKEN ,data.accessToken, 7);
        this.cookieService.set(REFRESH_TOKEN ,data.refreshToken, 7);
        this.authenticated = true;
        let oldUrl = this.cookieService.get("oldUrl");
        if (oldUrl) {
          this.router.navigateByUrl(oldUrl);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (): void => {
        this.translate.get([
          'alerts.login.failureTitle',
          'alerts.login.failureText',
          'alerts.login.ok',
        ]).subscribe(translations => {
          Swal.fire({
            title: translations['alerts.login.failureTitle'],
            text: translations['alerts.login.failureText'],
            icon: "error",
            confirmButtonText: translations['alerts.login.ok'],
            confirmButtonColor: colors['action-button'],
            background: colors['main-secondary-color'],
          })
        });
      }
    });
  }

  logout(): void {
    this.cookieService.delete(JWT_TOKEN);
    this.cookieService.delete(REFRESH_TOKEN);
    this.authenticated = false;

    this.router.navigate(['/login']);
  }


  profile(): Observable<Object> {
    return this.httpClient.get(this.baseUrl);
  }

  register(registerRequest: RegisterRequest):Observable<User> {
    return  this.httpClient.post<User>(`${this.baseUrl}register` , registerRequest);
  }

  refresh():  Observable<TokenResponse | null>  {
    const refreshToken: { refreshToken: string } = {"refreshToken": this.cookieService.get(REFRESH_TOKEN)};
    if (!refreshToken) return of(null);

    return this.httpClient
      .post<TokenResponse>(`${this.baseUrl}refresh`,
                                refreshToken,
                                { withCredentials: true })
      .pipe(
        tap((data: TokenResponse): void => {
          this.cookieService.set(JWT_TOKEN, data.accessToken, 7);
          this.cookieService.set(REFRESH_TOKEN, data.refreshToken, 7);
        }),
        map((data: TokenResponse): TokenResponse => data),
        catchError( (): Observable<null> => {
          return of(null);
        }
      ));
  }

  avatarUpload(file: File): Observable<User> {
    const form = new FormData();
    form.append('file', file);
    return this.httpClient.post<User>(this.path, form);
  }

  forgotPassword(forgotRequest: UsernameRequest): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}forgot-password`, forgotRequest);
  }

  confirmAccount(confirm_token: string): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}enable?token=${confirm_token}`);
  }

  avatarPath(user: User): string {
    return this.path + "/" + user.avatarPath;
  }
}

