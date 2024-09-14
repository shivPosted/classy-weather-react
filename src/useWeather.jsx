import { useEffect, useState } from "react";
import { fetchWeatherData } from "./util";

export default function useWeather(query) {
  const [weather, setWeather] = useState(null);
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
          country_code: countryCode,
        } = results[0];

        await fetchWeatherData(
          latitude,
          longitude,
          timezone,
          setWeather,
          name,
          countryCode,
        );
      } catch (err) {
        if (!(err.name === "AbortError")) console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    if (query.length > 1) fetchData();

    return () => controller.abort();
  }, [query]);

  return { isLoading, weather, setWeather };
}
