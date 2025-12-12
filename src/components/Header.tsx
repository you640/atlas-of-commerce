import { Button } from "@/components/ui/button";
import Logo from "./Logo";

const Header = () => {
  const navItems = ["Funkcie", "Cenník", "API Dokumentácia", "O nás"];

  return (
    <header className="sticky top-0 z-50 flex justify-between items-center px-6 lg:px-12 py-4 border-b border-border/50 glass">
      <Logo />

      <nav className="hidden lg:block">
        <ul className="flex gap-8">
          {navItems.map((item, index) => (
            <li key={item}>
              <a
                href="#"
                className={`nav-link ${index === 0 ? "active" : ""}`}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex gap-3">
        <Button variant="outline" size="default" className="hidden sm:flex">
          Prihlásiť sa
        </Button>
        <Button variant="primary" size="default">
          Vyskúšať zadarmo
        </Button>
      </div>
    </header>
  );
};

export default Header;
