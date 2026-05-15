export function updateUI(data) {
  document.querySelector('.value').textContent = data.current_weather.temperature + '°C';
}