import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calculator, BarChart3, Leaf, Globe } from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: Calculator,
      title: 'Easy Calculator',
      description: 'Simple, comprehensive tool to calculate your carbon footprint across all major categories.'
    },
    {
      icon: BarChart3,
      title: 'Visual Analytics',
      description: 'Beautiful charts and breakdowns to understand your environmental impact.'
    },
    {
      icon: Leaf,
      title: 'Actionable Insights',
      description: 'Get personalized suggestions to reduce your carbon footprint effectively.'
    },
    {
      icon: Globe,
      title: 'Global Impact',
      description: 'Join thousands of users working together for a sustainable future.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-white/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
              Track Your
              <span className="text-emerald-600 block">Carbon Footprint</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Understand your environmental impact and discover actionable ways to 
              create a more sustainable future for our planet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/calculator"
                className="inline-flex items-center px-8 py-4 bg-emerald-600 text-white font-semibold rounded-lg shadow-lg hover:bg-emerald-700 transform hover:scale-105 transition-all duration-200"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center px-8 py-4 bg-white text-emerald-600 font-semibold rounded-lg shadow-lg border-2 border-emerald-600 hover:bg-emerald-50 transform hover:scale-105 transition-all duration-200"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose EcoTracker?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our comprehensive platform makes it easy to understand and reduce 
              your environmental impact with scientific accuracy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 bg-gray-50 rounded-xl hover:bg-emerald-50 hover:shadow-lg transform hover:-translate-y-2 transition-all duration-300"
              >
                <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
                  <feature.icon className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Start your sustainability journey today. Calculate your carbon footprint 
            in just a few minutes and get personalized recommendations.
          </p>
          <Link
            to="/calculator"
            className="inline-flex items-center px-8 py-4 bg-white text-emerald-600 font-semibold rounded-lg shadow-lg hover:bg-gray-50 transform hover:scale-105 transition-all duration-200"
          >
            Calculate Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-emerald-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                10,000+
              </div>
              <p className="text-gray-600 text-lg">Carbon footprints calculated</p>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-emerald-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                2.5T
              </div>
              <p className="text-gray-600 text-lg">Average CO₂ reduced per user</p>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-emerald-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                50+
              </div>
              <p className="text-gray-600 text-lg">Countries using our platform</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;