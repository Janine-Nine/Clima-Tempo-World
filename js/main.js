import { fetchWeather } from './api.js';
import { updateUI } from './ui.js';

async function buscar() {
  const city = document.getElementById('city').value;
  const data = await fetchWeather(city);
  updateUI(data);
}

window.buscar = buscar;