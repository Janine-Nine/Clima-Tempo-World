/* ===============================
   ClimaWorld — script.js
   =============================== */

/*
  Este script:
  - Intercepta a busca por cidade
  - Simula dados climáticos
  - Atualiza a UI dinamicamente
  - Estrutura pronta para API real
*/

async function buscarClima() {
  const cityInput = document.getElementById('city');
  const cityName = cityInput.value.trim();

  if (!cityName) return;

  try {
    // 1️⃣ Geocoding
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=pt&format=json`;
    const geoResp = await fetch(geoUrl);
    const geoData = await geoResp.json();

    if (!geoData.results) {
      alert('Cidade não encontrada');
      return;
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // 2️⃣ Clima atual
    const weatherUrl = `
      https://api.open-meteo.com/v1/forecast
      ?latitude=${latitude}
      &longitude=${longitude}
      &current_weather=true
      &hourly=relativehumidity_2m
      &timezone=auto
    `;
    const weatherResp = await fetch(weatherUrl);
    const weatherData = await weatherResp.json();

    const current = weatherData.current_weather;
    const humidity = weatherData.hourly.relativehumidity_2m[0];

    // 3️⃣ Atualiza DOM
    document.querySelector('.city').textContent = `${name}, ${country}`;
    document.querySelector('.date').textContent =
      new Date().toLocaleString('pt-BR');

    document.querySelector('.value').textContent =
      `${current.temperature}°C`;

    document.querySelector('.desc').textContent =
      current.weathercode === 0 ? 'Céu limpo' : 'Condição variável';

    const meta = document.querySelectorAll('.meta strong');
    meta[0].textContent = `${current.temperature}°C`;
    meta[1].textContent = `${current.windspeed} km/h`;
    meta[2].textContent = `${humidity}%`;

  } catch (error) {
    console.error(error);
    alert('Erro ao buscar dados do clima');
  }
}
