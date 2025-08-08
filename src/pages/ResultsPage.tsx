import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, RotateCcw, TrendingDown, Award } from 'lucide-react';
import jsPDF from 'jspdf';

interface CalculationResult {
  total: number;
  breakdown: {
    vehicle: number;
    electricity: number;
    flights: number;
    diet: number;
    other: number;
  };
  suggestions: Array<{
    category: string;
    suggestion: string;
    potential: number;
  }>;
}

const ResultsPage = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [inputs, setInputs] = useState<any>(null);

  useEffect(() => {
    const storedResult = localStorage.getItem('calculationResult');
    const storedInputs = localStorage.getItem('calculationInputs');
    
    if (storedResult && storedInputs) {
      setResult(JSON.parse(storedResult));
      setInputs(JSON.parse(storedInputs));
    } else {
      navigate('/calculator');
    }
  }, [navigate]);

  if (!result || !inputs) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  const chartData = [
    { name: 'Transport', value: result.breakdown.vehicle, color: '#3B82F6' },
    { name: 'Energy', value: result.breakdown.electricity, color: '#EF4444' },
    { name: 'Flights', value: result.breakdown.flights, color: '#8B5CF6' },
    { name: 'Diet', value: result.breakdown.diet, color: '#F59E0B' },
    { name: 'Other', value: result.breakdown.other, color: '#10B981' }
  ];

  const barData = chartData.filter(item => item.value > 0);

  const getFootprintCategory = (total: number) => {
    if (total < 2.3) return { category: 'Excellent', color: 'text-green-600', description: 'Below Paris Agreement target' };
    if (total < 4) return { category: 'Good', color: 'text-emerald-600', description: 'Below global average' };
    if (total < 8) return { category: 'Average', color: 'text-orange-500', description: 'Around global average' };
    return { category: 'High', color: 'text-red-600', description: 'Above global average' };
  };

  const footprintCategory = getFootprintCategory(result.total);

  const generatePDF = () => {
    const pdf = new jsPDF();
    
    // Title
    pdf.setFontSize(20);
    pdf.text('Carbon Footprint Report', 20, 30);
    
    // Date
    pdf.setFontSize(12);
    pdf.text(`Generated on ${new Date().toLocaleDateString()}`, 20, 45);
    
    // Total emissions
    pdf.setFontSize(16);
    pdf.text(`Total Carbon Footprint: ${result.total} tonnes CO₂ per year`, 20, 65);
    
    // Breakdown
    pdf.setFontSize(14);
    pdf.text('Breakdown by Category:', 20, 85);
    
    let yPos = 100;
    Object.entries(result.breakdown).forEach(([category, value]) => {
      if (value > 0) {
        pdf.setFontSize(12);
        pdf.text(`${category.charAt(0).toUpperCase() + category.slice(1)}: ${value} tonnes CO₂`, 25, yPos);
        yPos += 15;
      }
    });
    
    // Suggestions
    yPos += 10;
    pdf.setFontSize(14);
    pdf.text('Recommendations:', 20, yPos);
    yPos += 15;
    
    result.suggestions.slice(0, 5).forEach((suggestion, index) => {
      pdf.setFontSize(10);
      const lines = pdf.splitTextToSize(`${index + 1}. ${suggestion.suggestion}`, 170);
      pdf.text(lines, 25, yPos);
      yPos += lines.length * 5 + 5;
    });
    
    pdf.save('carbon-footprint-report.pdf');
  };

  const totalPotentialReduction = result.suggestions.reduce((sum, suggestion) => sum + suggestion.potential, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Carbon Footprint</h1>
          <p className="text-xl text-gray-600">Here's your environmental impact breakdown and suggestions for improvement</p>
        </div>

        {/* Total Result Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Award className={`h-12 w-12 ${footprintCategory.color} mr-4`} />
            <div>
              <div className="text-5xl font-bold text-gray-900">{result.total}</div>
              <div className="text-lg text-gray-600">tonnes CO₂ per year</div>
            </div>
          </div>
          <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${footprintCategory.color} bg-opacity-10`}>
            {footprintCategory.category} - {footprintCategory.description}
          </div>
          <div className="mt-4 text-gray-600">
            Global average: 4.8 tonnes • Paris Agreement target: 2.3 tonnes
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Bar Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Emissions by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} tonnes CO₂`, 'Emissions']} />
                <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Proportion of Emissions</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={barData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} tonnes CO₂`, 'Emissions']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Reduction Suggestions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center mb-6">
            <TrendingDown className="h-6 w-6 text-emerald-600 mr-2" />
            <h3 className="text-xl font-semibold text-gray-900">Reduction Opportunities</h3>
          </div>
          <div className="mb-6">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <p className="text-emerald-800">
                <span className="font-semibold">Potential Total Reduction: {totalPotentialReduction.toFixed(1)} tonnes CO₂/year</span>
                <span className="text-sm block mt-1">
                  This could reduce your footprint by {((totalPotentialReduction / result.total) * 100).toFixed(1)}%
                </span>
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.suggestions.map((suggestion, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{suggestion.category}</h4>
                  <span className="text-sm font-medium text-emerald-600 bg-emerald-100 px-2 py-1 rounded">
                    -{suggestion.potential.toFixed(1)}t CO₂
                  </span>
                </div>
                <p className="text-gray-600 text-sm">{suggestion.suggestion}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={generatePDF}
            className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg shadow-lg hover:bg-emerald-700 transform hover:scale-105 transition-all duration-200"
          >
            <Download className="h-5 w-5 mr-2" />
            Download Report
          </button>
          <button
            onClick={() => navigate('/calculator')}
            className="inline-flex items-center px-6 py-3 bg-white text-emerald-600 font-semibold rounded-lg shadow-lg border-2 border-emerald-600 hover:bg-emerald-50 transform hover:scale-105 transition-all duration-200"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Calculate Again
          </button>
        </div>

        {/* Comparison Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">How You Compare</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-2xl font-bold text-blue-600 mb-2">2.3t</div>
              <div className="text-sm text-gray-600">Paris Agreement Target</div>
              <div className={`text-sm mt-2 ${result.total <= 2.3 ? 'text-green-600' : 'text-red-600'}`}>
                {result.total <= 2.3 ? '✓ You\'re on target!' : `${(result.total - 2.3).toFixed(1)}t over target`}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-2xl font-bold text-orange-500 mb-2">4.8t</div>
              <div className="text-sm text-gray-600">Global Average</div>
              <div className={`text-sm mt-2 ${result.total <= 4.8 ? 'text-green-600' : 'text-red-600'}`}>
                {result.total <= 4.8 ? `${(4.8 - result.total).toFixed(1)}t below average` : `${(result.total - 4.8).toFixed(1)}t above average`}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-2xl font-bold text-gray-700 mb-2">{result.total}t</div>
              <div className="text-sm text-gray-600">Your Current Footprint</div>
              <div className="text-sm mt-2 text-emerald-600">
                Potential: {(result.total - totalPotentialReduction).toFixed(1)}t with changes
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;