import React, { useState, useEffect, createContext, useContext } from 'react';
import './index.css';
import { Sun, Cloud } from 'lucide-react';

const WeatherContext = createContext();

const WeatherProvider = ({ children }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [city, setCity] = useState('');

  const fetchWeather = async (city) => {
    if (!city) return;
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=c6623d1a55d5da3157e3ed0231181ff0`
      );
      if (!response.ok) throw new Error('City not found');
      const data = await response.json();
      setWeatherData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
    }
  };

  return (
    <WeatherContext.Provider value={{ weatherData, error, setCity, fetchWeather }}>
      {children}
    </WeatherContext.Provider>
  );
};

const Search = () => {
  const { setCity, fetchWeather } = useContext(WeatherContext);
  const [input, setInput] = useState('');

  const handleSearch = () => {
    if (input.trim()) {
      setCity(input.trim());
      fetchWeather(input.trim());
      setInput('');
    }
  };

  return (
    <div className="flex justify-center my-4">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search for a city"
        className="p-2 border border-gray-300 rounded-l-md focus:outline-none"
      />
      <button onClick={handleSearch} className="bg-pink-900 text-white px-4 py-2 rounded-r-md hover:bg-pink-800">
        Search
      </button>
    </div>
  );
};

const WeatherDisplay = () => {
  const { weatherData } = useContext(WeatherContext);
  if (!weatherData) return <p className="text-center text-gray-500">No weather data available.</p>;

  const isGoodWeather = weatherData.weather[0].main === 'Clear';

  return (
    <div className={`rounded-xl shadow-lg p-6 text-center transition-colors duration-500 ${isGoodWeather ? 'bg-yellow-200 text-black' : 'bg-gray-800 text-white'}`}>
      <h2 className="text-2xl font-semibold">{weatherData.name}</h2>
      <div className="flex justify-center items-center my-4">
        {isGoodWeather ? <Sun size={48} className="text-yellow-500" /> : <Cloud size={48} className="text-gray-400" />}
        <div className="text-5xl font-bold ml-4">{weatherData.main.temp}°C</div>
      </div>
      <p className="text-lg capitalize">{weatherData.weather[0].description}</p>
      <div className="flex justify-around mt-4">
        <p>Humidity: {weatherData.main.humidity}%</p>
        <p>Wind: {weatherData.wind.speed} m/s</p>
      </div>
    </div>
  );
};

const ErrorDisplay = () => {
  const { error } = useContext(WeatherContext);
  return error ? <p className="text-red-500 text-center mt-2">{error}</p> : null;
};

const App = () => {
  return (
    <WeatherProvider>
      <MainApp />
    </WeatherProvider>
  );
};

const MainApp = () => {
  const { weatherData } = useContext(WeatherContext);
  const isLightTheme = weatherData && weatherData.weather[0].main === 'Clear';

  const bgClass = weatherData
    ? isLightTheme
      ? 'bg-yellow-100'
      : 'bg-gray-900'
    : 'bg-gradient-to-r from-[#330118] to-[#22000f]'; 

  const headingClass = weatherData ? (isLightTheme ? 'text-black' : 'text-white') : 'text-white';

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-500  ${bgClass}`}>
      <h1 className={`text-4xl font-bold mb-6 ${headingClass}`}>Weather Dashboard</h1>
      <Search />
      <ErrorDisplay />
      <WeatherDisplay />
    </div>
  );
};

export default App;

