// src/App.js
import React, { useState } from "react";


function App() {
  const [distance, setDistance] = useState("");
  const [emissions, setEmissions] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculateEmissions = async () => {
    if (!distance) return;
    setLoading(true);

    try {
      const response = await fetch(
        "https://carbon-footprint-estimator-wuq3.onrender.com/api/calculate", // Your Render backend URL
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ distance: parseFloat(distance) }),
        }
      );

      const data = await response.json();
      setEmissions(data.emissions);
    } catch (error) {
      console.error("Error calculating emissions:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Carbon Footprint Calculator</h1>
      <input
        type="number"
        placeholder="Enter distance (km)"
        value={distance}
        onChange={(e) => setDistance(e.target.value)}
      />
      <button onClick={calculateEmissions} disabled={loading}>
        {loading ? "Calculating..." : "Calculate"}
      </button>

      {emissions !== null && (
        <p>
          Estimated emissions: <strong>{emissions} kg CO₂</strong>
        </p>
      )}
    </div>
  );
}

export default App;
