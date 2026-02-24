

import { Injectable, NgZone } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpService } from './http.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private tokenExpiryCheckTimer: ReturnType<typeof setInterval> | null = null;
  private readonly TOKEN_EXPIRY_CHECK_INTERVAL = 5 * 60 * 1000;
  private readonly TOKEN_RENEWAL_THRESHOLD = 10 * 60 * 1000;

  constructor(
    private httpService: HttpService,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.initializeTokenRenewal();
  }

  // ============ JWT Token Methods ============

  getUserNameFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      return decoded.name || decoded.username || decoded.email || null;
    } catch (e) {
      return null;
    }
  }

  getUserEmailFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      return decoded.email || null;
    } catch (e) {
      return null;
    }
  }

  getToken(): string | null {
    return sessionStorage.getItem('accessToken');
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      const now = Math.floor(Date.now() / 1000);
      return decoded.exp ? decoded.exp < now : false;
    } catch (e) {
      return true;
    }
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  // ============ Authentication Methods ============

  onLogin(): void {
    this.checkAndRenewToken(); // Check immediately on login
  }

  logout(): void {
    sessionStorage.removeItem('accessToken');
    this.clearTimers();
    this.router.navigate(['/login']);
  }

  getApiUrl(): string {
    return environment.apiUrl;
  }

  // ============ Private Timer Management ============

  private initializeTokenRenewal(): void {
    this.ngZone.runOutsideAngular(() => {
      this.startTokenExpiryCheckTimer();
    });
  }

  private startTokenExpiryCheckTimer(): void {
    if (this.tokenExpiryCheckTimer) {
      clearInterval(this.tokenExpiryCheckTimer);
    }
    this.checkAndRenewToken();
    this.tokenExpiryCheckTimer = setInterval(() => {
      this.checkAndRenewToken();
    }, this.TOKEN_EXPIRY_CHECK_INTERVAL);
  }

  private checkAndRenewToken(): void {
    if (!this.isLoggedIn()) {
      return; // Not logged in, skip check
    }
    const token = this.getToken();
    if (!token) return;
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      const now = Math.floor(Date.now() / 1000);
      const expiresIn = (decoded.exp - now) * 1000;
      if (expiresIn < this.TOKEN_RENEWAL_THRESHOLD) {
        this.renewToken();
      }
    } catch (error) {
      console.error('Failed to check token expiry:', error);
    }
  }

  private renewToken(): void {
    this.httpService.post<{ accessToken: string }>('/users/renew-token', {}, undefined, { hideLoader: true })
      .subscribe({
        next: (response) => {
          sessionStorage.setItem('accessToken', response.accessToken);
        },
        error: () => {
          this.ngZone.run(() => this.logout());
        },
      });
  }

  private clearTimers(): void {
    if (this.tokenExpiryCheckTimer) {
      clearInterval(this.tokenExpiryCheckTimer);
      this.tokenExpiryCheckTimer = null;
    }
  }
}
