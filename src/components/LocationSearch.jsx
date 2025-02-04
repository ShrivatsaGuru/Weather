import React, { useState } from 'react';

const LocationSearch = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f0f0f0',
    minHeight: '100vh'
  };

  const inputContainerStyle = {
    display: 'flex',
    marginBottom: '20px'
  };

  const inputStyle = {
    padding: '10px',
    marginRight: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    width: '250px'
  };

  const buttonStyle = {
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  };

  const resultTabStyle = {
    width: '90%',
    minHeight: '500px',
    backgroundColor: '#e6f2ff',  // Slightly different color
    marginTop: '20px',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  };

  const handleSearch = () => {
    if (!input) {
      alert('Please enter a location');
      return;
    }

    const isNumeric = /^\d+$/.test(input);
    setResult({
      type: isNumeric ? 'Pincode' : 'City',
      name: input,
      details: `Detailed information for location: ${input}`
    });
  };

  return (
    <div style={containerStyle}>
      <div style={inputContainerStyle}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter city or pincode"
          style={inputStyle}
        />
        <button 
          onClick={handleSearch}
          style={buttonStyle}
        >
          Search
        </button>
      </div>

      <div style={resultTabStyle}>
        {result ? (
          <>
            <h2>{result.name}</h2>
            <p>Type: {result.type}</p>
            <p>{result.details}</p>
          </>
        ) : (
          <p>Search results will appear here</p>
        )}
      </div>
    </div>
  );
};

export default LocationSearch;