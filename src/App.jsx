import "./style.css";
import { useEffect, useState } from "react";
import { fetchWeatherData } from "./util";
import useWeather from "./useWeather";
function App() {
  const [query, setQuery] = useState("");
  const { isLoading, weather, setWeather } = useWeather(query);

  useEffect(() => {
    async function reverseGeoCode() {
      try {
        function geoLoactor() {
          if (!navigator.geolocation)
            alert("your browser does not support geolocation");

          navigator.geolocation.getCurrentPosition(success, error);

          async function success(position) {
            const { latitude: lat, longitude: lon } = position.coords;

            const res = await fetch(
              `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=204cec54c45543bb8119a66423c82d74`,
            );
            if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
            const { features } = await res.json();
            const {
              country_code: countryCode,
              timezone: { name: timezone },
              county,
            } = features[0].properties;
            console.log(features);
            fetchWeatherData(
              lat,
              lon,
              timezone,
              setWeather,
              county?.split(" ")[0],
              countryCode,
            );
            // await fetchWeatherData(lat, lon, 'GMT', )
          }

          function error() {
            alert("you denied the permission for location access");
          }
        }
        geoLoactor();
      } catch (err) {
        console.error(err.message);
      }
    }
    reverseGeoCode();
  }, [setWeather]);
  return (
    <div className="app">
      <h1>Classy Weather</h1>
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {weather && (
        <h2>
          Weather {weather.name}
          <span className="countryCode">
            {weather.countryCode?.toUpperCase()}
          </span>
        </h2>
      )}
      {isLoading ? (
        <p className="loader">Loading...</p>
      ) : (
        <WeatherList weatherData={weather} />
      )}
    </div>
  );
}

function WeatherList({ weatherData }) {
  return (
    <ul className="weather">
      {weatherData?.dayArr?.map((day, i) => (
        <WeatherDayCard
          key={i}
          day={day}
          tempMax={weatherData.tempMax[i]}
          tempMin={weatherData.tempMin[i]}
          icon={weatherData.icons[i]}
        />
      ))}
    </ul>
  );
}

function WeatherDayCard({ day, tempMax, tempMin, icon }) {
  return (
    <li className="day">
      <span>{icon}</span>
      <p>{day}</p>
      <p>
        {tempMin}°-<strong>{tempMax}°</strong>
      </p>
    </li>
  );
}
export default App;
