import React, { useState, useEffect } from 'react';

const LocationSearch = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [showWeather, setShowWeather] = useState(false);

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'start',
      justifyContent: 'space-between',
      padding: '20px',
      fontFamily: 'Arial',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    },
    leftSection: {
      width: '60%',
    },
    rightSection: {
      width: '35%',
      backgroundColor: '#e6f2ff',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
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
    setShowWeather(true);
  };

  return (
    <div style={styles.container}>
      <div style={styles.leftSection}>
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

        {result && (
          <div>
            <h2>{result.name}</h2>
            <p>Type: {result.type}</p>
            <p>{result.details}</p>
            {showWeather && <LocationCoordinates pincode={input} />}
          </div>
        )}
      </div>

      {showWeather && <WeatherForecast pincode={input} styles={styles.rightSection} />}
    </div>
  );
};

const LocationCoordinates = ({ pincode }) => {
  const [coordinates, setCoordinates] = useState(null);

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const geoResponse = await fetch(`https://geocode.maps.co/search?q=${pincode}&api_key=67a24edd44f06602789571rlwedeab5`);
        const geoData = await geoResponse.json();
        const location = geoData[0];
        setCoordinates({ lat: location.lat, lon: location.lon });
      } catch (error) {
        console.error('Error fetching coordinates:', error);
      }
    };

    if (pincode) fetchCoordinates();
  }, [pincode]);

  return (
    <div>
      {coordinates && (
        <div>
          <h3>Coordinates:</h3>
          <p>Latitude: {coordinates.lat}</p>
          <p>Longitude: {coordinates.lon}</p>
        </div>
      )}
    </div>
  );
};

const WeatherForecast = ({ pincode, styles }) => {
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const geoResponse = await fetch(`https://geocode.maps.co/search?q=${pincode}&api_key=67a24edd44f06602789571rlwedeab5`);
        const geoData = await geoResponse.json();
        const location = geoData[0];
        
        const weatherResponse = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${location.lat}&lon=${location.lon}&appid=fd34d7e3f4cd248076be579a17861c1b&units=metric&exclude=minutely`);
        const weatherData = await weatherResponse.json();
        
        setForecast(weatherData.daily.slice(0, 5));
      } catch (error) {
        console.error('Error fetching weather:', error);
      }
    };

    if (pincode) fetchWeather();
  }, [pincode]);

  return (
    <div style={styles}>
      <h3>5-Day Weather Forecast</h3>
      {forecast.length > 0 ? (
        forecast.map((day, index) => (
          <div key={index} style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px', marginBottom: '10px' }}>
            <p><strong>Day {index + 1}:</strong></p>
            <p>Temperature: {day.temp.day}°C</p>
            <p>Humidity: {day.humidity}%</p>
            <p>Wind Speed: {day.wind_speed} m/s</p>
            <p>Summary: {day.summary}</p>
          </div>
        ))
      ) : (
        <p>Loading weather data...</p>
      )}
    </div>
  );
};

export default LocationSearch;