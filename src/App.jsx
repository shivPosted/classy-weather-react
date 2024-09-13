import "./style.css";

function App() {
  return (
    <div className="app">
      <h1>Classy Weather</h1>
      <input type="text" placeholder="Search..." />
      <h2>Weather</h2>
      <WeatherList />
    </div>
  );
}

function WeatherList() {
  return (
    <ul className="weather">
      {Array.from({ length: 7 }, (item, i) => {
        return <WeatherDayCard data={i} />;
      })}
    </ul>
  );
}

function WeatherDayCard({ data }) {
  return (
    <li className="day">
      <span>☁️</span>
      <p>Today</p>
      <p>
        7-<strong>12</strong>
      </p>
    </li>
  );
}
export default App;
