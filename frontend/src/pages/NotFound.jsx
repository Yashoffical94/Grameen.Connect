import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-32 h-32 bg-surface2 rounded-full flex items-center justify-center mx-auto mb-6">
          <Search className="text-text-muted" size={64} />
        </div>
        <h1 className="text-6xl font-bold font-heading text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-text-muted mb-8">
          The page you're looking for doesn't exist or has been moved.
          Check the URL or return to the homepage.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/">
            <Button>
              <Home size={18} />
              Go Home
            </Button>
          </Link>
          <Link to="/jobs">
            <Button variant="secondary">
              Browse Jobs
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
