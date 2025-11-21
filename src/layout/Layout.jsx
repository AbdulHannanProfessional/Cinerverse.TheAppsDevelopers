import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from "../utils.js"
import { 
  Film, LayoutDashboard, Users, Clapperboard, 
  Shield, Settings, Bell, Menu, X, Search,
} from 'lucide-react';

export default function Layout({ children, currentPageName }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Allow everyone to access admin panel
  const isAdmin = true;

  const publicPages = [
    { name: 'Home', path: 'Home', icon: Film },
  ];

  const adminPages = [
    { name: 'Dashboard', path: 'AdminDashboard', icon: LayoutDashboard },
    { name: 'User Management', path: 'UserManagement', icon: Users },
    { name: 'Movie Management', path: 'MovieManagement', icon: Clapperboard },
    { name: 'Content Moderation', path: 'ContentModeration', icon: Shield },
    { name: 'Platform Settings', path: 'PlatformSettings', icon: Settings },
    { name: 'Notifications', path: 'NotificationManagement', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-[#0A0E17] text-[#E8E8E8]">
      <style>{`
        :root {
          --bg-primary: #0A0E17;
          --bg-secondary: #131720;
          --bg-card: #1A1F2E;
          --accent-gold: #F5C518;
          --accent-cyan: #00D9FF;
          --text-primary: #E8E8E8;
          --text-muted: #8B92A8;
          --border: #2A3144;
        }
        
        * {
          scrollbar-width: thin;
          scrollbar-color: var(--accent-gold) var(--bg-secondary);
        }
        
        *::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        *::-webkit-scrollbar-track {
          background: var(--bg-secondary);
        }
        
        *::-webkit-scrollbar-thumb {
          background: var(--accent-gold);
          border-radius: 4px;
        }
        
        *::-webkit-scrollbar-thumb:hover {
          background: #c79b00;
        }
      `}</style>

      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-[#131720] border-b border-[#2A3144] z-50 flex items-center px-6">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="mr-4 text-[#8B92A8] hover:text-[#F5C518] transition-colors"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <Link to={createPageUrl('Home')} className="flex items-center gap-3 mr-8">
          <Film className="w-8 h-8 text-[#F5C518]" />
          <div>
            <div className="text-xl font-bold text-[#F5C518]">Demo</div>
            <div className="text-xs text-[#8B92A8] -mt-1">By The Apps Developers</div>
          </div>
        </Link>

        <div className="flex-1 mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B92A8]" />
            <input
              type="text"
              placeholder="Search movies, actors, directors..."
              className="w-full bg-[#1A1F2E] border border-[#2A3144] rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#F5C518] transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-[#8B92A8]">Admin Access Enabled</div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-16 bottom-0 w-64 bg-[#131720] border-r border-[#2A3144] transform transition-transform duration-300 ease-in-out z-40 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="p-4 space-y-2">
          {/* Public Pages */}
          <div className="mb-6">
            <div className="text-xs font-semibold text-[#8B92A8] uppercase tracking-wider mb-2 px-3">
              Browse
            </div>
            {publicPages.map((page) => {
              const Icon = page.icon;
              const isActive = currentPageName === page.path;
              return (
                <Link
                  key={page.path}
                  to={createPageUrl(page.path)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                    isActive
                      ? 'bg-[#F5C518] text-[#0A0E17] font-semibold'
                      : 'text-[#E8E8E8] hover:bg-[#1A1F2E]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {page.name}
                </Link>
              );
            })}
          </div>

          {/* Admin Pages */}
          {isAdmin && (
            <div>
              <div className="text-xs font-semibold text-[#8B92A8] uppercase tracking-wider mb-2 px-3 pt-4 border-t border-[#2A3144]">
                Admin
              </div>
              {adminPages.map((page) => {
                const Icon = page.icon;
                const isActive = currentPageName === page.path;
                return (
                  <Link
                    key={page.path}
                    to={createPageUrl(page.path)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                      isActive
                        ? 'bg-[#F5C518] text-[#0A0E17] font-semibold'
                        : 'text-[#E8E8E8] hover:bg-[#1A1F2E]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {page.name}
                  </Link>
                );
              })}
            </div>
          )}
        </nav>
      </div>

      {/* Main Content */}
      <div
        className={`pt-16 transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-0'
        }`}
      >
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
