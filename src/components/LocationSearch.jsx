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
      marginBottom: '20px'
    },
    input: {
      padding: '10px',
      marginRight: '10px',
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
    resultTab: {
      width: '90%',
      minHeight: '500px',
      backgroundColor: '#e6f2ff',
      marginTop: '20px',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
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

      <div style={styles.resultTab}>
        {result && (
          <>
            <h2>{result.name}</h2>
            <p>Type: {result.type}</p>
            <p>{result.details}</p>
            {showWeather && <LocationCoordinates {...coordinates} />}
          </>
        )}
        {!result && <p>Search results will appear here</p>}
      </div>
    </div>
  );
};

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
          dailyForecasts: weatherData.daily.slice(0, 5).map((day) => ({
            date: new Date(day.dt * 1000).toLocaleDateString(),
            summary: day.summary,
            temperature: `${day.temp.day}°C`,
            humidity: `${day.humidity}%`,
            windSpeed: `${day.wind_speed} m/s`
          }))
        });
      } catch (error) {
        console.error('Error:', error);
      }
    };

    if (pincode || (lat && lon)) fetchData();
  }, [pincode, lat, lon]);

  return (
    <div>
      {coordinates && (
        <div>
          <h3>Coordinates:</h3>
          <p>Latitude: {coordinates.lat}</p>
          <p>Longitude: {coordinates.lon}</p>
        </div>
      )}
      {weather && (
        <div>
          <h3>5-Day Weather Forecast:</h3>
          {weather.dailyForecasts.map((day, index) => (
            <div key={index} style={{ marginBottom: '10px', borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>
              <p><strong>{day.date}</strong></p>
              <p>{day.summary}</p>
              <p>Temperature: {day.temperature}</p>
              <p>Humidity: {day.humidity}</p>
              <p>Wind Speed: {day.windSpeed}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
