import React, { useState } from 'react';

const DetectLocation = ({ onDetect }) => {
  const [error, setError] = useState(null);

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          onDetect(latitude, longitude);
        },
        (err) => {
          setError("Location access denied or unavailable.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div>
      <button onClick={handleDetectLocation} style={styles.button}>
        Detect My Location
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

const styles = {
  button: {
    padding: '10px 15px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px'
  }
};

export default DetectLocation;
