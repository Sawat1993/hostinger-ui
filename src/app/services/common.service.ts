

import { Injectable, NgZone } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpService } from './http.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  // Timers for token renewal and inactivity tracking
  private inactivityTimer: ReturnType<typeof setTimeout> | null = null;
  private renewTokenTimer: ReturnType<typeof setInterval> | null = null;

  // Configuration: Token lasts 1 hour, logout after 10 min inactivity, renew at 50 min mark
  private readonly INACTIVITY_TIMEOUT = 10 * 60 * 1000;
  private readonly TOKEN_RENEWAL_INTERVAL = 50 * 60 * 1000;

  constructor(
    private httpService: HttpService,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.initializeInactivityTracking();
  }

  // ============ JWT Token Methods ============

  /** Decode JWT and extract user name */
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

  /** Decode JWT and extract user email */
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

  /** Get token from session storage */
  getToken(): string | null {
    return sessionStorage.getItem('accessToken');
  }

  /** Check if token has expired */
  isTokenExpired(token: string): boolean {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      const now = Math.floor(Date.now() / 1000);
      return decoded.exp ? decoded.exp < now : false;
    } catch (e) {
      return true; // Treat invalid tokens as expired
    }
  }

  /** Check if user is logged in and token is valid */
  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  // ============ Authentication Methods ============

  /** Call this after successful login to start inactivity & renewal timers */
  onLogin(): void {
    this.resetInactivityTimer();
    this.startTokenRenewalTimer();
  }

  /** Logout user: clear token, stop timers, redirect to login */
  logout(): void {
    sessionStorage.removeItem('accessToken');
    this.clearTimers();
    this.router.navigate(['/login']);
  }

  getApiUrl(): string {
    return environment.apiUrl;
  }

  // ============ Private Timer Management ============

  /** Initialize timers on service creation (e.g., on page refresh) */
  private initializeInactivityTracking(): void {
    this.ngZone.runOutsideAngular(() => {
      if (this.isLoggedIn()) {
        this.resetInactivityTimer();
        this.startTokenRenewalTimer();
        this.setupActivityListeners(); // Add event listeners to track user activity
      }
    });
  }

  /** Setup event listeners to detect user activity and reset inactivity timer */
  private setupActivityListeners(): void {
    // Track these user actions: clicking, typing, scrolling, touching
    const activityEvents = ['click', 'keydown', 'scroll', 'touchstart', 'mousemove'];
    
    activityEvents.forEach((event) => {
      document.addEventListener(event, () => this.onUserActivity(), true);
    });
  }

  /** Called when user performs any activity - resets the inactivity timer */
  private onUserActivity(): void {
    // Only reset if user is logged in
    if (this.isLoggedIn()) {
      this.resetInactivityTimer();
    }
  }

  /** Start 10-minute inactivity countdown. Resets on each user activity. Auto-logout if no action for 10 min. */
  private resetInactivityTimer(): void {
    if (!this.isLoggedIn()) {
      this.clearTimers();
      return;
    }

    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }

    this.inactivityTimer = setTimeout(() => {
      this.ngZone.run(() => {
        console.warn('User inactive for 10 minutes. Logging out...');
        this.logout();
      });
    }, this.INACTIVITY_TIMEOUT);
  }

  /** Start automatic token renewal every 50 minutes (token lasts 1 hour) */
  private startTokenRenewalTimer(): void {
    if (this.renewTokenTimer) {
      clearInterval(this.renewTokenTimer);
    }

    this.renewTokenTimer = setInterval(() => {
      if (this.isLoggedIn()) {
        this.renewToken();
      }
    }, this.TOKEN_RENEWAL_INTERVAL);
  }

  /** Call backend to get a new token and update storage */
  private renewToken(): void {
    this.httpService.post<{ accessToken: string }>('/users/renew-token', {}, undefined, { hideLoader: true })
      .subscribe({
        next: (response) => {
          sessionStorage.setItem('accessToken', response.accessToken);
          console.log('Token renewed successfully');
        },
        error: () => {
          this.ngZone.run(() => this.logout()); // Token renewal failed, logout
        },
      });
  }

  /** Stop all active timers */
  private clearTimers(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }
    if (this.renewTokenTimer) {
      clearInterval(this.renewTokenTimer);
      this.renewTokenTimer = null;
    }
  }
}
