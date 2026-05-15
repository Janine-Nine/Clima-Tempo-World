import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeatherService } from '../src/app/weather.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  city = '';
  weatherData: any = null;
  forecastData: any = null;
  loading = false;
  error = '';

  constructor(private weatherService: WeatherService) {}

  ngOnInit() {
    this.searchWeather('Porto Alegre');
  }

  searchWeather(city?: string) {
    const searchCity = city || this.city;
    if (!searchCity) return;

    this.loading = true;
    this.error = '';

    this.weatherService.getWeather(searchCity).subscribe({
      next: (data: any) => {
        if (data.error) {
          this.error = data.error;
        } else {
          this.weatherData = data;
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao buscar dados do clima';
        this.loading = false;
      }
    });
  }

  searchForecast() {
    if (!this.city) return;

    this.loading = true;
    this.weatherService.getWeatherForecast(this.city, 7).subscribe({
      next: (data: any) => {
        if (data.error) {
          this.error = data.error;
        } else {
          this.forecastData = data;
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao buscar previsão';
        this.loading = false;
      }
    });
  }

  getWeatherDescription(code: number): string {
    const weatherCodes: { [key: number]: string } = {
      0: 'Céu limpo', 1: 'Predominantemente limpo', 2: 'Parcialmente nublado',
      3: 'Nublado', 45: 'Nevoeiro', 48: 'Nevoeiro gelado',
      51: 'Garoa leve', 53: 'Garoa moderada', 55: 'Garoa densa',
      61: 'Chuva leve', 63: 'Chuva moderada', 65: 'Chuva forte',
      71: 'Neve leve', 73: 'Neve moderada', 75: 'Neve forte',
      80: 'Pancadas de chuva leves', 81: 'Pancadas de chuva moderadas', 82: 'Pancadas de chuva fortes',
      95: 'Tempestade', 96: 'Tempestade com granizo leve', 99: 'Tempestade com granizo forte'
    };
    return weatherCodes[code] || 'Desconhecido';
  }
}
