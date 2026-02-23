



import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  getUserNameFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      // Try common JWT fields for name
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
      // Get email from JWT
      return decoded.email || null;
    } catch (e) {
      return null;
    }
  }

  logout(): void {
    sessionStorage.removeItem('accessToken');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  getToken(): string | null {
    return sessionStorage.getItem('accessToken');
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      if (!decoded.exp) return false;
      const now = Math.floor(Date.now() / 1000);
      return decoded.exp < now;
    } catch (e) {
      // If token is malformed or can't be decoded, treat as expired
      return true;
    }
  }

  getApiUrl(): string {
    return environment.apiUrl;
  }
}
