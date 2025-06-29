import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Holdings CTC Support</h3>
            <p className="text-gray-300 mb-4 max-w-md">
              Dedicated support portal for all Holdings CTC applications. 
              Get help, track tickets, and access our comprehensive knowledge base.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">support@holdingsctc.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">Business Hours: Mon-Fri 9AM-6PM EST</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/submit-ticket" className="text-gray-300 hover:text-white transition-colors">
                  Submit Ticket
                </Link>
              </li>
              <li>
                <Link to="/track-ticket" className="text-gray-300 hover:text-white transition-colors">
                  Track Ticket
                </Link>
              </li>
              <li>
                <Link to="/knowledge-base" className="text-gray-300 hover:text-white transition-colors">
                  Knowledge Base
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-gray-300 hover:text-white transition-colors">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Categories */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Support Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/knowledge-base?category=Account Management" className="text-gray-300 hover:text-white transition-colors">
                  Account Management
                </Link>
              </li>
              <li>
                <Link to="/knowledge-base?category=Portfolio Management" className="text-gray-300 hover:text-white transition-colors">
                  Portfolio Management
                </Link>
              </li>
              <li>
                <Link to="/knowledge-base?category=Analytics" className="text-gray-300 hover:text-white transition-colors">
                  Analytics
                </Link>
              </li>
              <li>
                <Link to="/knowledge-base?category=Technical Issues" className="text-gray-300 hover:text-white transition-colors">
                  Technical Issues
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Holdings CTC. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;