import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Zap, Plane, Utensils, Home, ArrowRight, ArrowLeft } from 'lucide-react';

interface FormData {
  vehicle: {
    type: string;
    kmPerWeek: number;
  };
  electricity: {
    kwhPerMonth: number;
  };
  flights: {
    shortHaul: number;
    longHaul: number;
  };
  diet: {
    type: string;
  };
  other: {
    publicTransportKm: number;
    heatingType: string;
    heatingKwh: number;
  };
}

const CalculatorPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    vehicle: {
      type: 'petrol',
      kmPerWeek: 0
    },
    electricity: {
      kwhPerMonth: 0
    },
    flights: {
      shortHaul: 0,
      longHaul: 0
    },
    diet: {
      type: 'mixed'
    },
    other: {
      publicTransportKm: 0,
      heatingType: 'gas',
      heatingKwh: 0
    }
  });

  const steps = [
    { number: 1, title: 'Transportation', icon: Car },
    { number: 2, title: 'Energy', icon: Zap },
    { number: 3, title: 'Travel', icon: Plane },
    { number: 4, title: 'Diet', icon: Utensils },
    { number: 5, title: 'Other', icon: Home }
  ];

  const vehicleTypes = [
    { value: 'petrol', label: 'Petrol Car', description: '0.271 kg CO₂/km' },
    { value: 'diesel', label: 'Diesel Car', description: '0.299 kg CO₂/km' },
    { value: 'hybrid', label: 'Hybrid Car', description: '0.120 kg CO₂/km' },
    { value: 'electric', label: 'Electric Car', description: '0.053 kg CO₂/km' },
    { value: 'motorcycle', label: 'Motorcycle', description: '0.113 kg CO₂/km' }
  ];

  const dietTypes = [
    { value: 'meat-heavy', label: 'Meat Heavy', description: 'Meat daily, 3.3t CO₂/year' },
    { value: 'mixed', label: 'Mixed Diet', description: 'Balanced diet, 2.5t CO₂/year' },
    { value: 'vegetarian', label: 'Vegetarian', description: 'No meat, 1.7t CO₂/year' },
    { value: 'vegan', label: 'Vegan', description: 'Plant-based, 1.5t CO₂/year' }
  ];

  const heatingTypes = [
    { value: 'gas', label: 'Natural Gas', description: '2.0 kg CO₂/kWh' },
    { value: 'oil', label: 'Oil', description: '2.5 kg CO₂/kWh' },
    { value: 'electric', label: 'Electric', description: '0.233 kg CO₂/kWh' }
  ];

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          userId: localStorage.getItem('userId') || 'anonymous'
        })
      });

      const result = await response.json();

      // Store results for the results page
      localStorage.setItem('calculationResult', JSON.stringify(result));
      localStorage.setItem('calculationInputs', JSON.stringify(formData));

      navigate('/results');
    } catch (error) {
      console.error('Calculation failed:', error);
      alert('Failed to calculate carbon footprint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Transportation</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vehicleTypes.map((type) => (
                  <label key={type.value} className="cursor-pointer">
                    <input
                      type="radio"
                      name="vehicleType"
                      value={type.value}
                      checked={formData.vehicle.type === type.value}
                      onChange={(e) => setFormData({
                        ...formData,
                        vehicle: { ...formData.vehicle, type: e.target.value }
                      })}
                      className="sr-only"
                    />
                    <div className={`p-4 border-2 rounded-lg transition-all ${formData.vehicle.type === type.value
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-emerald-300'
                      }`}>
                      <div className="font-medium text-gray-900">{type.label}</div>
                      <div className="text-sm text-gray-500">{type.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weekly Distance (km)
              </label>
              <input
                type="number"
                min="0"
                value={formData.vehicle.kmPerWeek}
                onChange={(e) => setFormData({
                  ...formData,
                  vehicle: { ...formData.vehicle, kmPerWeek: parseInt(e.target.value) || 0 }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="e.g., 200"
              />
              <p className="mt-1 text-sm text-gray-500">
                Include commuting, errands, and leisure driving
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Energy Consumption</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Electricity Usage (kWh)
              </label>
              <input
                type="number"
                min="0"
                value={formData.electricity.kwhPerMonth}
                onChange={(e) => setFormData({
                  ...formData,
                  electricity: { kwhPerMonth: parseInt(e.target.value) || 0 }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="e.g., 350"
              />
              <p className="mt-1 text-sm text-gray-500">
                Check your electricity bill or estimate based on home size
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Average Household Usage</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>Small home or flat: 200–300 kWh/month</li>
                <li>Medium-sized home: 300–500 kWh/month</li>
                <li>Large home: 500–800+ kWh/month</li>
              </ul>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Air Travel</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short-haul Flights per Year
              </label>
              <input
                type="number"
                min="0"
                value={formData.flights.shortHaul}
                onChange={(e) => setFormData({
                  ...formData,
                  flights: { ...formData.flights, shortHaul: parseInt(e.target.value) || 0 }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="e.g., 4"
              />
              <p className="mt-1 text-sm text-gray-500">
                Domestic or flights under 4 hours (150 kg CO₂ each)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Long-haul Flights per Year
              </label>
              <input
                type="number"
                min="0"
                value={formData.flights.longHaul}
                onChange={(e) => setFormData({
                  ...formData,
                  flights: { ...formData.flights, longHaul: parseInt(e.target.value) || 0 }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="e.g., 2"
              />
              <p className="mt-1 text-sm text-gray-500">
                International or flights over 4 hours (600 kg CO₂ each)
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Diet</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Which diet best describes your eating habits?
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dietTypes.map((diet) => (
                  <label key={diet.value} className="cursor-pointer">
                    <input
                      type="radio"
                      name="dietType"
                      value={diet.value}
                      checked={formData.diet.type === diet.value}
                      onChange={(e) => setFormData({
                        ...formData,
                        diet: { type: e.target.value }
                      })}
                      className="sr-only"
                    />
                    <div className={`p-4 border-2 rounded-lg transition-all ${formData.diet.type === diet.value
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-emerald-300'
                      }`}>
                      <div className="font-medium text-gray-900">{diet.label}</div>
                      <div className="text-sm text-gray-500">{diet.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Other Factors</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Public Transport (km per week)
              </label>
              <input
                type="number"
                min="0"
                value={formData.other.publicTransportKm}
                onChange={(e) => setFormData({
                  ...formData,
                  other: { ...formData.other, publicTransportKm: parseInt(e.target.value) || 0 }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="e.g., 50"
              />
              <p className="mt-1 text-sm text-gray-500">Bus, train, subway usage</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Home Heating Type
              </label>
              <div className="grid grid-cols-1 gap-2">
                {heatingTypes.map((heating) => (
                  <label key={heating.value} className="cursor-pointer">
                    <input
                      type="radio"
                      name="heatingType"
                      value={heating.value}
                      checked={formData.other.heatingType === heating.value}
                      onChange={(e) => setFormData({
                        ...formData,
                        other: { ...formData.other, heatingType: e.target.value }
                      })}
                      className="sr-only"
                    />
                    <div className={`p-3 border-2 rounded-lg transition-all ${formData.other.heatingType === heating.value
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-emerald-300'
                      }`}>
                      <div className="font-medium text-gray-900">{heating.label}</div>
                      <div className="text-sm text-gray-500">{heating.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Heating Energy (kWh)
              </label>
              <input
                type="number"
                min="0"
                value={formData.other.heatingKwh}
                onChange={(e) => setFormData({
                  ...formData,
                  other: { ...formData.other, heatingKwh: parseInt(e.target.value) || 0 }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="e.g., 200"
              />
              <p className="mt-1 text-sm text-gray-500">
                Average heating energy consumption
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${step.number <= currentStep
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : 'border-gray-300 text-gray-500'
                  }`}>
                  <step.icon className="h-5 w-5" />
                </div>
                <span className="mt-2 text-xs font-medium text-gray-500 hidden sm:block">
                  {step.title}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-gray-200 rounded-full h-2">
            <div
              className="bg-emerald-500 rounded-full h-2 transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </button>

            <button
              onClick={nextStep}
              disabled={loading}
              className="flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                'Calculating...'
              ) : currentStep === steps.length ? (
                'Calculate Results'
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="text-center mt-6">
          <span className="text-sm text-gray-500">
            Step {currentStep} of {steps.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CalculatorPage;