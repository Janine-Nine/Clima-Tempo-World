export async function fetchWeather(city) {
  const res = await fetch(`/api/weather/${city}`);
  return res.json();
}