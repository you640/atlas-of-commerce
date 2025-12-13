import { LayoutDashboard, Search, FileText, BarChart3, Settings, Plug } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Search, label: "Hľadať", active: false },
  { icon: FileText, label: "Reporty", active: false },
  { icon: BarChart3, label: "Analytika", active: false },
  { icon: Plug, label: "API", active: false },
];

const MobileNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item, index) => (
          <button
            key={index}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors",
              item.active
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default MobileNav;
