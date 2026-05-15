const fetch = require('node-fetch');

exports.getWeather = async (req, res) => {
  const city = req.params.city;

  try {
    const geo = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`);
    const geoData = await geo.json();

    if (!geoData.results) return res.status(404).json({ error: 'Cidade não encontrada' });

    const { latitude, longitude } = geoData.results[0];

    const weather = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
    const weatherData = await weather.json();

    res.json(weatherData);

  } catch (err) {
    res.status(500).json({ error: 'Erro no servidor' });
  }
};