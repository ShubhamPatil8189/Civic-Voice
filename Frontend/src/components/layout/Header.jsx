import { Link, useLocation } from "react-router-dom";
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = ({ variant = "landing" }) => {
  const location = useLocation();

  const landingLinks = [
    { href: "/schemes", label: "Schemes" },
    { href: "/about", label: "About" },
    { href: "/help", label: "Help" },
  ];

  const appLinks = [
    { href: "/schemes", label: "Schemes" },
    { href: "/profile", label: "My Profile" },
    { href: "/help", label: "Help" },
  ];

  const links = variant === "landing" ? landingLinks : appLinks;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Building2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg">Civic Voice Interface</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === link.href
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {variant === "landing" ? (
            <Button size="sm" className="rounded-full px-6">
              Login
            </Button>
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="rounded-full">
                Profile
              </Button>
              <div className="h-9 w-9 rounded-full bg-orange-100 flex items-center justify-center">
                <span className="text-orange-600 text-sm font-medium">U</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
