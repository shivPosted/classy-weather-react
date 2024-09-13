import "./style.css";
import { useState } from "react";
import { useWeather } from "./util";
function App() {
  const [query, setQuery] = useState("");
  const { isLoading, weather } = useWeather(query);

  console.log(weather);
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
          <span className="countryCode">{weather.countryCode}</span>
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
      {weatherData.dayArr?.map((day, i) => (
        <WeatherDayCard
          key={i}
          day={day}
          tempMax={weatherData.tempMax[i]}
          tempMin={weatherData.tempMin[i]}
        />
      ))}
    </ul>
  );
}

function WeatherDayCard({ day, tempMax, tempMin }) {
  return (
    <li className="day">
      <span>☁️</span>
      <p>{day}</p>
      <p>
        {tempMin}°-<strong>{tempMax}°</strong>
      </p>
    </li>
  );
}
export default App;
