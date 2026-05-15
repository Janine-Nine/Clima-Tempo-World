import { Component, Input, OnChanges } from '@angular/core';
import Chart from 'chart.js/auto';
import { Component, Input, OnChanges } from '@angular/core';
import Chart from 'chart.js/auto';
import zoomPlugin from 'chartjs-plugin-zoom';

Chart.register(zoomPlugin);

@Component({
  selector: 'app-weather-chart',
  templateUrl: './weather-chart.component.html'
})
export class WeatherChartComponent implements OnChanges {

  @Input() data: any;

  chart: any;

  ngOnChanges() {
    if (!this.data) return;

    const temps = this.data.hourly.temperature_2m.slice(0, 12);
    const labels = temps.map((_, i) => `${i}h`);

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart('weatherChart', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Temperatura (°C)',
          data: temps,
          tension: 0.4
        }]
      },
      options: {
        responsive: true
      }
    });
  }
}
