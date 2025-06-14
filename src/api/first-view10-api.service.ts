import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
  StudentTrips, NotificationResponse10, RecentLocation,
  NotificationDistanceResponse
} from './first-view10-models';
import {environmentSecret} from '../environments/environment.secret';

@Injectable({ providedIn: 'root' })
export class FirstView10ApiService {
  private readonly BASE_URL = environmentSecret.BASE_URL;

  constructor(private http: HttpClient) {}

  private getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private setToken(token: string) {
    localStorage.setItem('auth_token', token);
  }

  private decodeJwt(token: string): any | null {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  }

  private isTokenExpired(token: string): boolean {
    const decoded = this.decodeJwt(token);
    if (!decoded || !decoded.exp) return true;
    return Date.now() > decoded.exp * 1000;
  }

  private refreshToken(): Observable<string> {
    const url = this.BASE_URL + '/gist';
    return this.http.get(url, { responseType: 'text' }).pipe(
      switchMap(token => {
        if (token) this.setToken(token);
        return of(token);
      })
    );
  }

  private getAuthHeaders(): Observable<HttpHeaders> {
    let token = this.getToken();
    if (!token || this.isTokenExpired(token)) {
      return this.refreshToken().pipe(
        switchMap(newToken => of(this.buildHeaders(newToken)))
      );
    }
    return of(this.buildHeaders(token));
  }

  private buildHeaders(token: string | null): HttpHeaders {
    let headers = new HttpHeaders({
      'Accept':'application/json',
      'User-Agent':'okhttp/4.9.2',
      'app-client-platform':'android',
      'app-client-build':'455'
    });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  getStudentTrips(date: string): Observable<StudentTrips> {
    return this.getAuthHeaders().pipe(
      switchMap(headers =>
        this.http.get<StudentTrips>(this.BASE_URL + '/student-trips', {
          headers,
          params: new HttpParams().set('date', date)
        })
      )
    );
  }

  getNotifications(skip: number, limit: number): Observable<NotificationResponse10> {
    return this.getAuthHeaders().pipe(
      switchMap(headers =>
        this.http.get<NotificationResponse10>(this.BASE_URL + '/notifications', {
          headers,
          params: new HttpParams().set('skip', skip).set('limit', limit)
        })
      )
    );
  }

  getRecentLocation(vehicleIds: string): Observable<RecentLocation[]> {
    return this.getAuthHeaders().pipe(
      switchMap(headers =>
        this.http.get<RecentLocation[]>(this.BASE_URL + '/recent-location', {
          headers,
          params: new HttpParams().set('vehicleIds', vehicleIds)
        })
      )
    );
  }

  getNotificationDistances(date: string): Observable<NotificationDistanceResponse> {
    return this.getAuthHeaders().pipe(
      switchMap(headers =>
        this.http.get<NotificationDistanceResponse>(this.BASE_URL + '/notifications/distance', {
          headers,
          params: new HttpParams().set('date', date)
        })
      )
    );
  }
}
