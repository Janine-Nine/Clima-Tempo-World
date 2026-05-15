import { Injectable } from '@nestjs/common';

@Injectable()
export class WeatherService {
  async getWeatherByCity(city: string) {
    try {
      // Primeiro, obter coordenadas da cidade
      const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`);
      const geoData = await geoResponse.json();

      if (!geoData.results) {
        return { error: 'Cidade não encontrada' };
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      // Agora obter dados do clima
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m&timezone=auto`
      );

      const weatherData = await weatherResponse.json();

      return {
        city: name,
        country: country,
        current: weatherData.current,
        timezone: weatherData.timezone
      };
    } catch (error) {
      return { error: 'Erro ao buscar dados do clima' };
    }
  }

  async getWeatherForecast(city: string, days: number = 7) {
    try {
      const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`);
      const geoData = await geoResponse.json();

      if (!geoData.results) {
        return { error: 'Cidade não encontrada' };
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max&timezone=auto&forecast_days=${days}`
      );

      const weatherData = await weatherResponse.json();

      return {
        city: name,
        country: country,
        daily: weatherData.daily,
        timezone: weatherData.timezone
      };
    } catch (error) {
      return { error: 'Erro ao buscar previsão do tempo' };
    }
  }
}