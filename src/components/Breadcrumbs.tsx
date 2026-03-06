import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-zinc-500 mb-6">
      <Link 
        to="/projects" 
        className="flex items-center hover:text-zinc-900 transition-colors"
      >
        <Home className="w-4 h-4" />
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4 text-zinc-300" />
          {item.to ? (
            <Link 
              to={item.to} 
              className="hover:text-zinc-900 transition-colors font-medium"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-zinc-900 font-semibold">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
