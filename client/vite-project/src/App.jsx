import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import { FaTemperatureHigh } from "react-icons/fa";
import { WiHumidity } from "react-icons/wi";
import { FaWind } from "react-icons/fa";
import { GiSunrise } from "react-icons/gi";
import { FaTimes } from "react-icons/fa";
const App = () => {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [unit, setUnit] = useState("Celsius"); // Default unit
  const [threshold, setThreshold] = useState(30); // Default threshold in Celsius

  useEffect(() => {
    // Fetch city names
    const fetchCities = async () => {
      const cityNames = [
        "Mumbai",
        "Delhi",
        "Bangalore",
        "Hyderabad",
        "Ahmedabad",
        "Chennai",
        "Kolkata",
        "Surat",
        "Pune",
        "Jaipur",
        "Kanpur",
        "Nagpur",
        "Visakhapatnam",
        "Indore",
        "Thane",
        "Bhopal",
        "Coimbatore",
        "Patna",
        "Vadodara",
        "Nagpur",
        "Guwahati",
        "Chandigarh",
        "Lucknow",
        "Kochi",
        "Noida",
        "Navi Mumbai",
        "Mysuru",
        "Vijayawada",
        "Jodhpur",
        "Agra",
        "Bhubaneswar",
        "Pimpri-Chinchwad",
        "Rajkot",
        "Dehradun",
        "Srinagar",
        "Faridabad",
        "Dharamshala",
        "Udaipur",
        "Mangalore",
        "Amritsar",
      ];

      setCities(cityNames);
    };
    fetchCities();
  }, []);

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  const handleUnitChange = (event) => {
    setUnit(event.target.value);
  };

  const getWeather = async () => {
    if (selectedCity) {
      const API_KEY = "9e725be6ccdaa38c8b4c48dafcb4d49a"; // Replace with your OpenWeather API Key
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${API_KEY}`
        );
        const temperatureInCelsius = (response.data.main.temp - 273.15).toFixed(
          2
        );
        const data = {
          temperature: temperatureInCelsius,
          temperature_min: (response.data.main.temp_min - 273.15).toFixed(2),
          temperature_max: (response.data.main.temp_max - 273.15).toFixed(2),
          feels_like: (response.data.main.feels_like - 273.15).toFixed(2),
          weather: response.data.weather[0].description,
          timestamp: Date.now(),
          wind_speed: (response.data.wind.speed * 2.23694).toFixed(2),
          humidity: response.data.main.humidity,
        };

        // Alert if temperature exceeds threshold
        if (unit === "Celsius" && temperatureInCelsius > threshold) {
          alert(
            `Alert! The temperature in ${selectedCity} exceeds ${threshold}°C!`
          );
        } else if (
          unit === "Fahrenheit" &&
          celsiusToFahrenheit(temperatureInCelsius) > threshold
        ) {
          alert(
            `Alert! The temperature in ${selectedCity} exceeds ${threshold}°F!`
          );
        }

        setWeatherData(data);
      } catch (error) {
        console.error(error);
        alert("Failed to fetch weather data. Please try again.");
      }
    }
  };

  const celsiusToFahrenheit = (celsius) => (celsius * 9) / 5 + 32;
  //const fahrenheitToCelsius = (fahrenheit) => (fahrenheit - 32) * 5/9;

  return (
    <div className="App">
      <h1 className="header">Weather App</h1>
      <div className="container">
        <select
          className="city-select"
          onChange={handleCityChange}
          value={selectedCity}
        >
          <option value="">Select a city</option>
          {cities.map((city, index) => (
            <option key={index} value={city}>
              {city}
            </option>
          ))}
        </select>

        <select
          className="unit-select"
          onChange={handleUnitChange}
          value={unit}
        >
          <option value="Celsius">Celsius</option>
          <option value="Fahrenheit">Fahrenheit</option>
        </select>

        <input
          type="number"
          placeholder="Threshold Temperature"
          value={threshold}
          onChange={(e) => setThreshold(e.target.value)}
          className="threshold-input"
        />

        <button className="fetch-btn" onClick={getWeather}>
          Get Weather
        </button>

        {weatherData && (
          <div className="weather-info">
            <h2>Weather in {selectedCity}</h2>
            <p>
              {" "}
              <FaTemperatureHigh /> Temperature:{" "}
              {unit === "Celsius"
                ? weatherData.temperature + " °C"
                : celsiusToFahrenheit(weatherData.temperature) + " °F"}
            </p>
            <p>
              <FaTemperatureHigh />
              Feels Like:{" "}
              {unit === "Celsius"
                ? weatherData.feels_like + " °C"
                : celsiusToFahrenheit(weatherData.feels_like) + " °F"}
            </p>
            <p>
              {" "}
              <GiSunrise />
              Condition: {weatherData.weather}
            </p>
            <p>
              <WiHumidity />
              Humidity: {weatherData.humidity}%
            </p>
            <p>
              <FaWind />
              Wind Speed: {weatherData.wind_speed} Mph
            </p>
            <p>
              <FaTemperatureHigh />
              Maximum Temperature:{" "}
              {unit === "Celsius"
                ? weatherData.temperature_max + " °C"
                : celsiusToFahrenheit(weatherData.temperature_max) + " °F"}
            </p>
            <p>
              <FaTemperatureHigh />
              Minimum Temperature:{" "}
              {unit === "Celsius"
                ? weatherData.temperature_min + " °C"
                : celsiusToFahrenheit(weatherData.temperature_min) + " °F"}
            </p>
            <p>
              <FaTimes /> Timestamp:{" "}
              {new Date(weatherData.timestamp).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
