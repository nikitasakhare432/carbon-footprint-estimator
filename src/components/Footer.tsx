import React from 'react';
import { Leaf, Github, Mail, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-emerald-500 p-2 rounded-full">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">EcoTracker</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Track, understand, and reduce your carbon footprint with our comprehensive 
              carbon calculator. Take action for a sustainable future.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="text-gray-300 hover:text-emerald-400 transition-colors">About</a></li>
              <li><a href="/calculator" className="text-gray-300 hover:text-emerald-400 transition-colors">Calculator</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-emerald-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">Climate Science</a></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">Sustainability Tips</a></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">Carbon Offsetting</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © 2025 EcoTracker. All rights reserved.
            </p>
            <p className="text-gray-300 text-sm flex items-center mt-2 md:mt-0">
              Made with <Heart className="h-4 w-4 text-red-500 mx-1" /> for the planet
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;