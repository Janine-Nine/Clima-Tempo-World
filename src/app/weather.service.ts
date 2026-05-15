import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private apiUrl = 'http://localhost:3000/weather';

  constructor(private http: HttpClient) {}

  getWeather(city: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${city}`);
  }

  getWeatherForecast(city: string, days: number = 7): Observable<any> {
    return this.http.get(`${this.apiUrl}/forecast/${city}?days=${days}`);
  }
}
