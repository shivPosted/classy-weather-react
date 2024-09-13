import countryEmoji from "country-emoji";
import { useEffect, useState } from "react";

function dayFormatter(dateStr) {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
  }).format(new Date(dateStr));
}

function truncValue(arr) {
  return arr.map((item) => Math.trunc(item));
}
function useWeather(query) {
  const [weather, setWeather] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      try {
        setIsLoading(true);
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${query}`,
          { signal: controller.signal },
        );
        if (!geoRes.ok)
          throw new Error(`${geoRes.status}: ${geoRes.statusText}`);

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
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=temperature_2m_max,temperature_2m_min,weather_code`,
        );
        if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);

        const { daily } = await res.json();
        console.log(daily);
        const {
          time,
          temperature_2m_max: tempMax,
          temperature_2m_min: tempMin,
        } = daily;

        const dayArr = time.map((dateStr, i) => {
          if (i === 0) return "Today";
          return dayFormatter(dateStr);
        });

        setWeather({
          dayArr,
          tempMax: truncValue(tempMax),
          tempMin: truncValue(tempMin),
          name,
          countryCode,
          country,
        });
      } catch (err) {
        if (!(err.name === "AbortError")) console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    if (query.length > 1) fetchData();

    return () => controller.abort();
  }, [query]);

  return { isLoading, weather };
}

export { useWeather };
