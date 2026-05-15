import { Component } from '@angular/core';
import { WeatherService } from './weather.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html'
})
export class WeatherComponent {
  city = '';
  data: any;

  constructor(private service: WeatherService) {}

  buscar() {
    this.service.getWeather(this.city).subscribe(res => {
      this.data = res;
    });
  }
}
