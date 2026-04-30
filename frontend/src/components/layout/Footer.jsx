import { Link } from 'react-router-dom';
import { Briefcase, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Briefcase className="text-background" size={20} />
              </div>
              <span className="font-heading font-bold text-xl text-text">
                Grameen Connect
              </span>
            </Link>
            <p className="text-text-muted text-sm">
              Connecting rural labour to contractors across India — fast, free, and verified.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 bg-surface2 rounded-lg text-text-muted hover:text-primary transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="p-2 bg-surface2 rounded-lg text-text-muted hover:text-primary transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 bg-surface2 rounded-lg text-text-muted hover:text-primary transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="p-2 bg-surface2 rounded-lg text-text-muted hover:text-primary transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-text mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/workers" className="text-text-muted hover:text-primary transition-colors">
                  Find Workers
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="text-text-muted hover:text-primary transition-colors">
                  Find Jobs
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-text-muted hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-text-muted hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* For Workers */}
          <div>
            <h4 className="font-semibold text-text mb-4">For Workers</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/signup?role=labour" className="text-text-muted hover:text-primary transition-colors">
                  Create Profile
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="text-text-muted hover:text-primary transition-colors">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-text-muted hover:text-primary transition-colors">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-text mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-text-muted">
                <Mail size={16} className="mt-0.5 flex-shrink-0" />
                <span>support@grameenconnect.in</span>
              </li>
              <li className="flex items-start gap-2 text-text-muted">
                <Phone size={16} className="mt-0.5 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-2 text-text-muted">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span>Patna, Bihar, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-text-muted text-sm">
            © 2026 Grameen Connect. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-text-muted hover:text-text text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-text-muted hover:text-text text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
