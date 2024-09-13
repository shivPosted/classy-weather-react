import countryEmoji from "country-emoji";

async function fetchData(query) {
  try {
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${query}`,
    );
    if (!geoRes.ok) throw new Error(`${geoRes.status}: ${geoRes.statusText}`);

    const { results } = await geoRes.json();
    const {
      latitude,
      longitude,
      timezone,
      name,
      country,
      country_code: countryCode,
    } = results[0];

    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=temperature_2m_max,temperature_2m_min`,
    );
    if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);

    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.log(err.message);
  } finally {
  }
}

export { fetchData };
