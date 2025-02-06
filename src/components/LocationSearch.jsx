import React, { useState, useEffect } from 'react';
import DetectLocation from './DetectLocation';

const LocationSearch = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [showWeather, setShowWeather] = useState(false);
  const [coordinates, setCoordinates] = useState(null);

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      fontFamily: 'Arial',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    },
    inputContainer: {
      display: 'flex',
      gap: '10px',
      marginBottom: '20px'
    },
    input: {
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      width: '250px'
    },
    button: {
      padding: '10px 15px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    },
    weatherContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      width: '90%',
      backgroundColor: '#e6f2ff',
      marginTop: '20px',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    },
    currentWeather: {
      flex: 1,
      padding: '20px',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      marginRight: '10px'
    },
    forecastContainer: {
      flex: 1,
      padding: '20px',
      backgroundColor: '#ffffff',
      borderRadius: '8px'
    },
    forecastItem: {
      borderBottom: '1px solid #ccc',
      paddingBottom: '5px',
      marginBottom: '10px'
    }
  };

  const handleSearch = () => {
    if (!input) {
      alert('Please enter a location');
      return;
    }
    setResult({
      type: /^\d+$/.test(input) ? 'Pincode' : 'City',
      name: input,
      details: `Detailed information for location: ${input}`
    });
    setCoordinates({ pincode: input });
    setShowWeather(true);
  };

  const handleDetect = (lat, lon) => {
    setCoordinates({ lat, lon });
    setResult({
      type: 'Current Location',
      name: `Lat: ${lat}, Lon: ${lon}`,
      details: `Weather information for your current location.`
    });
    setShowWeather(true);
  };

  return (
    <div style={styles.container}>
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter city or pincode"
          style={styles.input}
        />
        <button onClick={handleSearch} style={styles.button}>
          Search
        </button>
      </div>

      <DetectLocation onDetect={handleDetect} />

      {result && (
        <div style={styles.weatherContainer}>
          <LocationCoordinates {...coordinates} />
        </div>
      )}
    </div>
  );
};
// const getWeatherIcon = (iconCode) => {
//   try {
//     return require(`../assets/${iconCode}.png`);
//   } catch (error) {
//     console.error("Icon not found:", iconCode);
//     return require(`../assets/01d.png`); // Add a default icon in assets
//   }
// };
const LocationCoordinates = ({ pincode, lat, lon }) => {
  const [coordinates, setCoordinates] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let latitude, longitude;

        if (pincode) {
          // Fetch lat/lon using pincode
          const geoResponse = await fetch(`https://geocode.maps.co/search?q=${pincode}&api_key=67a24edd44f06602789571rlwedeab5`);
          const geoData = await geoResponse.json();
          const location = geoData[0];
          latitude = location.lat;
          longitude = location.lon;
        } else {
          // Use detected lat/lon
          latitude = lat;
          longitude = lon;
        }

        setCoordinates({ lat: latitude, lon: longitude });

        // Fetch weather data
        const weatherResponse = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&appid=fd34d7e3f4cd248076be579a17861c1b&units=metric&exclude=minutely`);
        const weatherData = await weatherResponse.json();

        setWeather({
          current: {
            temperature: weatherData.current.temp,
            humidity: weatherData.current.humidity,
            windSpeed: weatherData.current.wind_speed,
            description: weatherData.current.weather[0].description,
            icon: weatherData.current.weather[0].icon
          },
          dailyForecasts: weatherData.daily.slice(1, 6).map((day) => ({
            date: new Date(day.dt * 1000).toLocaleDateString(),
            summary: day.summary,
            temperature: `${day.temp.day}°C`,
            humidity: `${day.humidity}%`,
            windSpeed: `${day.wind_speed} m/s`,
            description:`${day.weather[0].description}`,
            icon:`${day.weather[0].icon}`
          }))
        });
      } catch (error) {
        console.error('Error:', error);
      }
    };

    if (pincode || (lat && lon)) fetchData();
  }, [pincode, lat, lon]);

  return (
    <>
      {weather && (
        <>
          {/* Current Weather */}
          <div style={{ flex: 1, padding: '20px', backgroundColor: '#ffffff', borderRadius: '8px', marginRight: '10px' }}>
            <h3>Current Weather</h3>
            <p><strong>Temperature:</strong> {weather.current.temperature}°C</p>
            <p><strong>Humidity:</strong> {weather.current.humidity}%</p>
            <p><strong>Wind Speed:</strong> {weather.current.windSpeed} m/s</p>
            <p><strong>Description:</strong> {weather.current.description}</p>
            <img src={require(`../assets/${weather.current.icon}.png`)} alt="Weather icon" />
          </div>
  
          {/* 5-Day Forecast */}
          <div style={{ flex: 1, padding: '20px', backgroundColor: '#ffffff', borderRadius: '8px' }}>
            <h3>5-Day Weather Forecast</h3>
            {weather.dailyForecasts.map((day, index) => (
              <div key={index} style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px', marginBottom: '10px' }}>
                <p><strong>{day.date}</strong></p>
                <p>{day.summary}</p>
                <p><strong>Temperature:</strong> {day.temperature}</p>
                <p><strong>Humidity:</strong> {day.humidity}</p>
                <p><strong>Wind Speed:</strong> {day.windSpeed} </p>
                <p><strong>Description:</strong> {day.description}</p>
                <img src={require(`../assets/${day.icon}.png`)} alt="Weather icon" />
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
  
  
  
  
  
};

export default LocationSearch;
