import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private apiUrl = 'http://localhost:3000/api';
  private tokenKey = 'travlr-token';

  constructor(private http: HttpClient) {}

  public login(
    email: string,
    password: string
  ): Observable<AuthResponse> {

    return this.http
      .post<AuthResponse>(
        `${this.apiUrl}/login`,
        {
          email,
          password
        }
      )
      .pipe(
        tap((response: AuthResponse) => {
          this.saveToken(response.token);
        })
      );
  }

  public saveToken(token: string): void {
    localStorage.setItem(
      this.tokenKey,
      token
    );
  }

  public getToken(): string | null {
    return localStorage.getItem(
      this.tokenKey
    );
  }

  public logout(): void {
    localStorage.removeItem(
      this.tokenKey
    );
  }

  public isLoggedIn(): boolean {

    const token = this.getToken();

    if (!token) {
      return false;
    }

    try {
      const payload = JSON.parse(
        atob(token.split('.')[1])
      );

      return payload.exp >
        Date.now() / 1000;

    } catch {
      this.logout();
      return false;
    }
  }
}
