import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeatherService } from '../src/app/weather.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  city = '';
  weatherData: any = null;
  forecastData: any = null;
  loading = false;
  error = '';
  chart: any;

  constructor(private weatherService: WeatherService) {}

  ngOnInit() {
    this.loadWeather('Porto Alegre');
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  loadWeather(city: string) {
    this.city = city;
    this.loading = true;
    this.error = '';

    this.weatherService.getWeather(city).subscribe({
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

  loadForecast() {
    if (!this.city) return;

    this.loading = true;
    this.weatherService.getWeatherForecast(this.city, 7).subscribe({
      next: (data: any) => {
        if (data.error) {
          this.error = data.error;
        } else {
          this.forecastData = data;
          this.createChart();
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao buscar previsão';
        this.loading = false;
      }
    });
  }

  createChart() {
    if (!this.forecastData || !this.forecastData.daily) return;

    const ctx = document.getElementById('weatherChart') as HTMLCanvasElement;
    if (!ctx) return;

    if (this.chart) {
      this.chart.destroy();
    }

    const daily = this.forecastData.daily;
    const labels = daily.time.map((t: string) => {
      const date = new Date(t);
      return date.toLocaleDateString('pt-BR', { weekday: 'short' });
    });

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Temp Máx (°C)',
            data: daily.temperature_2m_max,
            borderColor: '#f97316',
            backgroundColor: 'rgba(249,115,22,0.2)',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Temp Mín (°C)',
            data: daily.temperature_2m_min,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59,130,246,0.2)',
            fill: true,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          }
        },
        scales: {
          y: {
            title: {
              display: true,
              text: 'Temperatura (°C)'
            }
          }
        }
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
