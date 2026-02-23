import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError, finalize } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoaderService } from './loader.service';

export interface HttpConfig {
  hideLoader?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private loaderService: LoaderService
  ) {}

  private buildUrl(url: string): string {
    // If url is absolute, don't prepend
    if (/^https?:\/\//.test(url)) return url;
    return `${environment.apiUrl}${url.startsWith('/') ? url : '/' + url}`;
  }

  get<T>(url: string, params?: any, headers?: HttpHeaders, config?: HttpConfig): Observable<T> {
    if (!config?.hideLoader) {
      this.loaderService.show();
    }
    return this.http.get<T>(this.buildUrl(url), {
      params: params ? new HttpParams({ fromObject: params }) : undefined,
      headers,
    }).pipe(
      catchError((error) => this.handleErrorToast(error)),
      finalize(() => {
        if (!config?.hideLoader) {
          this.loaderService.hide();
        }
      })
    );
  }

  post<T>(url: string, body: any, headers?: HttpHeaders, config?: HttpConfig): Observable<T> {
    if (!config?.hideLoader) {
      this.loaderService.show();
    }
    return this.http.post<T>(this.buildUrl(url), body, { headers }).pipe(
      catchError((error) => this.handleErrorToast(error)),
      finalize(() => {
        if (!config?.hideLoader) {
          this.loaderService.hide();
        }
      })
    );
  }

  put<T>(url: string, body: any, headers?: HttpHeaders, config?: HttpConfig): Observable<T> {
    if (!config?.hideLoader) {
      this.loaderService.show();
    }
    return this.http.put<T>(this.buildUrl(url), body, { headers }).pipe(
      catchError((error) => this.handleErrorToast(error)),
      finalize(() => {
        if (!config?.hideLoader) {
          this.loaderService.hide();
        }
      })
    );
  }

  patch<T>(url: string, body: any, headers?: HttpHeaders, config?: HttpConfig): Observable<T> {
    if (!config?.hideLoader) {
      this.loaderService.show();
    }
    return this.http.patch<T>(this.buildUrl(url), body, { headers }).pipe(
      catchError((error) => this.handleErrorToast(error)),
      finalize(() => {
        if (!config?.hideLoader) {
          this.loaderService.hide();
        }
      })
    );
  }

  delete<T>(url: string, params?: any, headers?: HttpHeaders, config?: HttpConfig): Observable<T> {
    if (!config?.hideLoader) {
      this.loaderService.show();
    }
    return this.http.delete<T>(this.buildUrl(url), {
      params: params ? new HttpParams({ fromObject: params }) : undefined,
      headers,
    }).pipe(
      catchError((error) => this.handleErrorToast(error)),
      finalize(() => {
        if (!config?.hideLoader) {
          this.loaderService.hide();
        }
      })
    );
  }

  private handleErrorToast(error: any) {
    this.messageService.add({
      severity: 'error',
      summary: error?.error?.message || error?.message || 'Error',
    });
    return throwError(() => error);
  }
}
