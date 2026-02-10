import { Link, useLocation } from "react-router-dom";
import { Building2, LogIn, User, Home, FileText, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Header = ({ variant = "landing" }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const landingLinks = [
    { href: "/schemes", label: "Schemes", icon: FileText },
    { href: "/about", label: "About", icon: Building2 },
    { href: "/help", label: "Help", icon: HelpCircle },
  ];

  const appLinks = [
    { href: "/schemes", label: "Schemes", icon: FileText },
    { href: "/profile", label: "My Profile", icon: User },
    { href: "/help", label: "Help", icon: HelpCircle },
  ];

  const links = variant === "landing" ? landingLinks : appLinks;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative p-2 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl shadow-md">
                <Building2 className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                CivicAssist
              </span>
              <span className="text-xs text-gray-500 font-medium hidden sm:block">
                Official Government Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="group relative px-3 py-2 rounded-lg transition-all hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-gray-500 group-hover:text-purple-600 transition-colors" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-purple-600 transition-colors">
                  Home
                </span>
              </div>
              <div className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </Link>

            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className="group relative px-3 py-2 rounded-lg transition-all hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-gray-500 group-hover:text-purple-600 transition-colors" />
                    <span className={`text-sm font-medium transition-colors ${
                      location.pathname === link.href
                        ? "text-purple-600 font-semibold"
                        : "text-gray-700 group-hover:text-purple-600"
                    }`}>
                      {link.label}
                    </span>
                  </div>
                  {location.pathname === link.href && (
                    <div className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500"></div>
                  )}
                </Link>
              );
            })}

            {/* ✅ FIXED: Login Button linking to /login */}
            <Link to="/login">
              <Button 
                variant="default" 
                size="sm" 
                className="gap-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 shadow-md hover:shadow-lg transition-all duration-300 group"
              >
                <LogIn className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span className="font-semibold">Login / Sign Up</span>
              </Button>
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-3">
            <Link to="/login">
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2 bg-gradient-to-r from-purple-100 to-cyan-100 hover:from-purple-200 hover:to-cyan-200 text-purple-700 border border-purple-200"
              >
                <LogIn className="h-4 w-4" />
                <span className="font-medium">Login</span>
              </Button>
            </Link>
            
            <Button 
              variant="ghost" 
              size="icon"
              className="relative"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <div className="space-y-1">
                <div className={`w-6 h-0.5 bg-gray-600 transition-transform ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
                <div className={`w-6 h-0.5 bg-gray-600 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
                <div className={`w-6 h-0.5 bg-gray-600 transition-transform ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
              </div>
            </Button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b shadow-lg rounded-b-2xl mx-4 overflow-hidden animate-slideDown">
            <div className="py-3 px-4 space-y-1">
              <Link
                to="/"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="h-5 w-5 text-gray-500" />
                <span className="font-medium text-gray-700">Home</span>
              </Link>
              
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5 text-gray-500" />
                    <span className="font-medium text-gray-700">{link.label}</span>
                  </Link>
                );
              })}
              
              <div className="pt-3 border-t">
                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold hover:from-purple-700 hover:to-cyan-700 transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LogIn className="h-5 w-5" />
                  Login / Sign Up
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </header>
  );
};

export default Header;