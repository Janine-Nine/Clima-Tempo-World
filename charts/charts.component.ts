import { Component, Input, OnChanges } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html'
})
export class ChartsComponent implements OnChanges {

  @Input() data: any;
  chart: any;

  ngOnChanges() {
    if (!this.data) return;

    const temps = this.data.hourly.temperature_2m.slice(0, 24);
    const humidity = this.data.hourly.relativehumidity_2m.slice(0, 24);
    const labels = temps.map((_, i) => `${i}h`);

    if (this.chart) this.chart.destroy();

    this.chart = new Chart('tempChart', {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Temperatura (°C)',
            data: temps,
            borderColor: '#38bdf8',
            backgroundColor: 'rgba(56,189,248,0.2)',
            fill: true
          },
          {
            label: 'Umidade (%)',
            data: humidity,
            borderColor: '#22c55e',
            backgroundColor: 'rgba(34,197,94,0.2)',
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        interaction: {
          mode: 'index',
          intersect: false
        }
      }
    });
  }
}
getWeather(city: string) {
  return this.http.get(`http://localhost:3000/api/weather/${city}`);
}
