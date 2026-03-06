import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Tags, 
  Package, 
  BookOpen,
  Home,
  ChevronLeft,
  ChevronRight,
  Search
} from 'lucide-react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/projects', icon: LayoutDashboard, label: 'Projects' },
    { to: '/industries', icon: Building2, label: 'Industries' },
    { to: '/categories', icon: Tags, label: 'Categories' },
    { to: '/products', icon: Package, label: 'Products' },
  ];

  return (
    <aside 
      className={`
        bg-white border-r border-zinc-200 h-screen flex flex-col sticky top-0 transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-64'}
      `}
    >
      <div className={`p-6 flex items-center justify-between border-b border-zinc-100 ${isCollapsed ? 'px-4' : ''}`}>
        <Link to="/" className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 bg-zinc-900 rounded-lg flex-shrink-0 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <h1 className="font-semibold text-zinc-900 tracking-tight whitespace-nowrap">Marketing Notebook</h1>
          )}
        </Link>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative group
              ${isActive 
                ? 'bg-zinc-100 text-zinc-900' 
                : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'}
              ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span>{item.label}</span>}
            
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-zinc-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                {item.label}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-zinc-100 space-y-4">
        {!isCollapsed && (
          <div className="bg-zinc-50 rounded-xl p-4">
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Research Mode</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs text-zinc-600 font-medium">Active Session</span>
            </div>
          </div>
        )}
        
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`
            w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-colors
            ${isCollapsed ? 'justify-center' : ''}
          `}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!isCollapsed && <span>Collapse Sidebar</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
