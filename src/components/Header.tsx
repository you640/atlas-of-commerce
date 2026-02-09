import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "./Logo";

interface HeaderProps {
  onLogoLongPress?: () => void;
}

const Header = ({ onLogoLongPress }: HeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const navItems = [
    { label: "Funkcie", href: "/#funkcie" },
    { label: "Cenník", href: "/cennik" },
    { label: "API Dokumentácia", href: "/#api" },
    { label: "O nás", href: "/#o-nas" },
  ];

  return (
    <header className="sticky top-0 z-50 flex justify-between items-center px-6 lg:px-12 py-4 border-b border-border/50 glass">
      <Link to="/">
        <Logo onLongPress={onLogoLongPress} />
      </Link>

      <nav className="hidden lg:block">
        <ul className="flex gap-8">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link
                to={item.href}
                className={`nav-link ${location.pathname === item.href ? "active" : ""}`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex gap-3">
        <Button variant="outline" size="default" className="hidden sm:flex">
          Prihlásiť sa
        </Button>
        <Button variant="primary" size="default" onClick={() => navigate("/dashboard")}>
          Vyskúšať zadarmo
        </Button>
      </div>
    </header>
  );
};

export default Header;
