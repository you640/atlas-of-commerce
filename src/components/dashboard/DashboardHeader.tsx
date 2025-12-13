import { Bell, HelpCircle, Menu, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

interface DashboardHeaderProps {
  onMenuClick?: () => void;
}

const DashboardHeader = ({ onMenuClick }: DashboardHeaderProps) => {
  return (
    <header className="sticky top-0 z-50 glass border-b border-border">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4">
        <Logo />
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <HelpCircle className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground md:hidden" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="px-4 pb-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Vyhľadať firmu podľa IČO alebo názvu..."
            className="pl-12 h-12 bg-muted/50 border-border text-foreground placeholder:text-muted-foreground rounded-xl"
          />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
