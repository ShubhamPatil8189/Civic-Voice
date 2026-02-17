import { Link, useLocation } from "react-router-dom";
import { Building2, LogIn, UserPlus, Home, FileText, HelpCircle, LogOut, User, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const Header = ({ variant = "landing" }) => {
const { t } = useTranslation();
const location = useLocation();

const [isLoggedIn, setIsLoggedIn] = useState(false);
const [user, setUser] = useState(null);

// 🔥 LOGIN DETECTOR
const checkLoginStatus = () => {
const userData = localStorage.getItem("user");


if (userData) {
  setIsLoggedIn(true);
  setUser(JSON.parse(userData));
} else {
  setIsLoggedIn(false);
  setUser(null);
}


};

useEffect(() => {
checkLoginStatus();


// when login happens
window.addEventListener("login", checkLoginStatus);

return () => {
  window.removeEventListener("login", checkLoginStatus);
};


}, [location]);

// LOGOUT
const handleLogout = () => {
localStorage.removeItem("user");
window.dispatchEvent(new Event("login"));
window.location.href = "/";
};

const links = [
{ href: "/schemes", label: "Schemes", icon: FileText },
{ href: "/story-mode", label: "Story Mode", icon: BookOpen },
{ href: "/help", label: "Help", icon: HelpCircle },
];

return ( <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm"> <div className="container mx-auto px-4"> <div className="flex h-16 items-center justify-between">


      {/* Logo */}
      <Link to="/" className="flex items-center gap-3">
        <div className="p-2 bg-purple-600 rounded-xl">
          <Building2 className="h-6 w-6 text-white" />
        </div>
        <span className="text-xl font-bold text-purple-600">Civic Voice</span>
      </Link>

      {/* Navigation */}
      <nav className="flex items-center gap-4">

        <Link to="/" className="flex items-center gap-1 text-gray-700">
          <Home className="h-4 w-4" /> Home
        </Link>

        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link key={link.href} to={link.href} className="flex items-center gap-1 text-gray-700">
              <Icon className="h-4 w-4" /> {link.label}
            </Link>
          );
        })}

        {/* ===== AUTH BUTTONS ===== */}

        {isLoggedIn ? (
          <>
            <span className="text-sm text-gray-600 ml-2">
              Hi, {user?.firstName}
            </span>

            <Link to="/profile">
              <Button variant="outline" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                Profile
              </Button>
            </Link>

            <Button
              onClick={handleLogout}
              size="sm"
              className="gap-2 bg-red-500 hover:bg-red-600 text-white"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link to="/login">
              <Button variant="outline" size="sm" className="gap-2">
                <LogIn className="h-4 w-4" />
                Login
              </Button>
            </Link>

            <Link to="/register">
              <Button size="sm" className="gap-2 bg-purple-600 text-white">
                <UserPlus className="h-4 w-4" />
                Sign Up
              </Button>
            </Link>
          </>
        )}

      </nav>
    </div>
  </div>
</header>


);
};

export default Header;
