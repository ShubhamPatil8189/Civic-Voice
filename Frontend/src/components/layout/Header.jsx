import { Link, useLocation } from "react-router-dom";
import { Building2, LogIn, UserPlus, Home, FileText, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const Header = ({ variant = "landing" }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const landingLinks = [
    { href: "/schemes", label: t('header.schemes'), icon: FileText },
    { href: "/about", label: t('header.about'), icon: Building2 },
    { href: "/help", label: t('header.help'), icon: HelpCircle },
  ];

  const appLinks = [
    { href: "/schemes", label: t('header.schemes'), icon: FileText },
    { href: "/profile", label: t('header.my_profile'), icon: UserPlus },
    { href: "/help", label: t('header.help'), icon: HelpCircle },
  ];

  const links = variant === "landing" ? landingLinks : appLinks;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-xl shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl shadow-md group-hover:shadow-lg transition-shadow">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                {t('app.title')}
              </span>
              <span className="text-xs text-gray-500 font-medium hidden sm:block">
                {t('header.official_platform')}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors ${location.pathname === "/" ? "bg-gray-50" : ""
                }`}
            >
              <Home className="h-4 w-4 text-gray-500" />
              <span className={`text-sm font-medium ${location.pathname === "/"
                  ? "text-purple-600 font-semibold"
                  : "text-gray-700"
                }`}>
                {t('header.home')}
              </span>
            </Link>

            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-3 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors ${location.pathname === link.href ? "bg-gray-50" : ""
                    }`}
                >
                  <Icon className="h-4 w-4 text-gray-500" />
                  <span className={`text-sm font-medium ${location.pathname === link.href
                      ? "text-purple-600 font-semibold"
                      : "text-gray-700"
                    }`}>
                    {link.label}
                  </span>
                </Link>
              );
            })}

            {/* LOGIN BUTTON */}
            <Link to="/login">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-purple-500 text-purple-600 hover:bg-purple-50 hover:text-purple-700 transition-all"
              >
                <LogIn className="h-4 w-4" />
                {t('header.login')}
              </Button>
            </Link>

            {/* REGISTER BUTTON */}
            <Link to="/register">
              <Button
                size="sm"
                className="gap-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:from-purple-700 hover:to-cyan-700 transition-all shadow-md hover:shadow-lg"
              >
                <UserPlus className="h-4 w-4" />
                {t('header.signup')}
              </Button>
            </Link>
          </nav>

          {/* Mobile buttons */}
          <div className="flex md:hidden items-center gap-2">
            <Link to="/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
              >
                {t('header.login')}
              </Button>
            </Link>

            <Link to="/register">
              <Button
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:from-purple-700 hover:to-cyan-700"
              >
                {t('header.signup')}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu (if needed) */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-2">
              <Link
                to="/"
                className="px-3 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">{t('header.home')}</span>
              </Link>

              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="px-3 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      {link.label}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;