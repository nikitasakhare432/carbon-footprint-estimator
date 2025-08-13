import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database(':memory:');

// Emission factors (kg CO₂)
const EMISSION_FACTORS = {
  vehicles: {
    petrol: 0.271, // kg CO₂/km
    diesel: 0.299,
    hybrid: 0.120,
    electric: 0.053,
    motorcycle: 0.113
  },
  electricity: 0.233, // kg CO₂/kWh
  flights: {
    short: 150, // kg CO₂ per short flight
    long: 600   // kg CO₂ per long flight
  },
  diet: {
    'meat-heavy': 3300, // kg CO₂/year
    mixed: 2500,
    vegetarian: 1700,
    vegan: 1500
  },
  publicTransport: 0.089, // kg CO₂/km
  heating: {
    gas: 2.0, // kg CO₂/kWh
    oil: 2.5,
    electric: 0.233
  }
};

// Initialize database tables
db.serialize(() => {
  // Results table
  db.run(`
    CREATE TABLE IF NOT EXISTS results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      total_emissions REAL,
      vehicle_emissions REAL,
      electricity_emissions REAL,
      flight_emissions REAL,
      diet_emissions REAL,
      other_emissions REAL,
      data TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Contact messages table
  db.run(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// Calculate carbon footprint
app.post('/api/calculate', (req, res) => {
  try {
    const {
      vehicle: { type, kmPerWeek },
      electricity: { kwhPerMonth },
      flights: { shortHaul, longHaul },
      diet: { type: dietType },
      other: { publicTransportKm, heatingType, heatingKwh }
    } = req.body;

    // Calculate emissions for each category
    const vehicleEmissions = (kmPerWeek * 52 * EMISSION_FACTORS.vehicles[type]) / 1000; // tonnes
    const electricityEmissions = (kwhPerMonth * 12 * EMISSION_FACTORS.electricity) / 1000; // tonnes
    const flightEmissions = (
      (shortHaul * EMISSION_FACTORS.flights.short) +
      (longHaul * EMISSION_FACTORS.flights.long)
    ) / 1000; // tonnes
    const dietEmissions = EMISSION_FACTORS.diet[dietType] / 1000; // tonnes

    // Other emissions
    const publicTransportEmissions = publicTransportKm ? (publicTransportKm * 52 * EMISSION_FACTORS.publicTransport) / 1000 : 0;
    const heatingEmissions = heatingType && heatingKwh ? (heatingKwh * 12 * EMISSION_FACTORS.heating[heatingType]) / 1000 : 0;
    const otherEmissions = publicTransportEmissions + heatingEmissions;

    const totalEmissions = vehicleEmissions + electricityEmissions + flightEmissions + dietEmissions + otherEmissions;

    const result = {
      total: Math.round(totalEmissions * 100) / 100,
      breakdown: {
        vehicle: Math.round(vehicleEmissions * 100) / 100,
        electricity: Math.round(electricityEmissions * 100) / 100,
        flights: Math.round(flightEmissions * 100) / 100,
        diet: Math.round(dietEmissions * 100) / 100,
        other: Math.round(otherEmissions * 100) / 100
      },
      suggestions: generateSuggestions({
        vehicleEmissions,
        electricityEmissions,
        flightEmissions,
        dietEmissions,
        otherEmissions,
        vehicleType: type,
        dietType
      })
    };

    // Save to database
    const userId = req.body.userId || 'anonymous';
    db.run(`
      INSERT INTO results 
      (user_id, total_emissions, vehicle_emissions, electricity_emissions, flight_emissions, diet_emissions, other_emissions, data)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      userId,
      result.total,
      result.breakdown.vehicle,
      result.breakdown.electricity,
      result.breakdown.flights,
      result.breakdown.diet,
      result.breakdown.other,
      JSON.stringify(req.body)
    ]);

    res.json(result);
  } catch (error) {
    console.error('Calculation error:', error);
    res.status(500).json({ error: 'Calculation failed' });
  }
});

// Generate reduction suggestions
function generateSuggestions({ vehicleEmissions, electricityEmissions, flightEmissions, dietEmissions, vehicleType, dietType }) {
  const suggestions = [];

  if (vehicleEmissions > 2) {
    if (vehicleType === 'petrol' || vehicleType === 'diesel') {
      suggestions.push({
        category: 'Transport',
        suggestion: 'Consider switching to a hybrid or electric vehicle to reduce emissions by up to 80%',
        potential: Math.round(vehicleEmissions * 0.8 * 100) / 100
      });
    }
    suggestions.push({
      category: 'Transport',
      suggestion: 'Use public transport, cycling, or walking for short trips',
      potential: Math.round(vehicleEmissions * 0.3 * 100) / 100
    });
  }

  if (electricityEmissions > 1.5) {
    suggestions.push({
      category: 'Energy',
      suggestion: 'Switch to renewable energy provider or install solar panels',
      potential: Math.round(electricityEmissions * 0.7 * 100) / 100
    });
    suggestions.push({
      category: 'Energy',
      suggestion: 'Improve home insulation and use energy-efficient appliances',
      potential: Math.round(electricityEmissions * 0.25 * 100) / 100
    });
  }

  if (flightEmissions > 1) {
    suggestions.push({
      category: 'Travel',
      suggestion: 'Reduce air travel or choose direct flights when possible',
      potential: Math.round(flightEmissions * 0.5 * 100) / 100
    });
  }

  if (dietType === 'meat-heavy') {
    suggestions.push({
      category: 'Diet',
      suggestion: 'Reduce meat consumption or try "Meatless Mondays"',
      potential: Math.round(dietEmissions * 0.4 * 100) / 100
    });
  }

  return suggestions;
}

// Contact form endpoint
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;

  db.run(`
    INSERT INTO contact_messages (name, email, message)
    VALUES (?, ?, ?)
  `, [name, email, message], function (err) {
    if (err) {
      console.error('Contact form error:', err);
      res.status(500).json({ error: 'Failed to save message' });
    } else {
      res.json({ success: true, id: this.lastID });
    }
  });
});

// Get historical results
app.get('/api/results/:userId', (req, res) => {
  const { userId } = req.params;

  db.all(`
    SELECT total_emissions, created_at
    FROM results 
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT 10
  `, [userId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Failed to fetch results' });
    } else {
      res.json(rows);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});