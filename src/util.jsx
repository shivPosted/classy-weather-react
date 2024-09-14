import { useEffect, useState } from "react";

export async function fetchWeatherData(
  lat,
  long,
  timezone,
  setWeather,
  name,
  countryCode,
) {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&timezone=${timezone}&daily=temperature_2m_max,temperature_2m_min,weather_code`,
    );
    if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);

    const { daily } = await res.json();
    console.log(daily);
    const {
      time,
      temperature_2m_max: tempMax,
      temperature_2m_min: tempMin,
      weather_code: weatherCode,
    } = daily;

    const dayArr = time.map((dateStr, i) => {
      if (i === 0) return "Today";
      return dayFormatter(dateStr);
    });
    const icons = formIcon(weatherCode);

    setWeather({
      dayArr,
      tempMax: truncValue(tempMax),
      tempMin: truncValue(tempMin),
      name,
      countryCode,
      icons,
    });
  } catch (err) {
    console.error(err.message);
  }
}

function dayFormatter(dateStr) {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
  }).format(new Date(dateStr));
}

function truncValue(arr) {
  return arr.map((item) => Math.trunc(item));
}

function formIcon(arr) {
  const mapping = [
    [[0], "☀️"],
    [[1], "🌤"],
    [[2], "⛅️"],
    [[3], "☁️"],
    [[45, 48], "🌫"],
    [[51, 56, 61, 66, 80], "🌦"],
    [[53, 55, 63, 65, 57, 67, 81, 82], "🌧"],
    [[71, 73, 75, 77, 85, 86], "🌨"],
    [[95], "🌩"],
    [[96, 99], "⛈"],
  ];

  return arr.map((code) => {
    const item = mapping.find((map) => map[0].includes(code));
    return item[1];
  });
}
