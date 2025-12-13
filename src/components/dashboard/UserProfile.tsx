import { LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const UserProfile = () => {
  return (
    <div className="glass rounded-xl p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 border-2 border-primary/50">
          <AvatarFallback className="bg-muted text-foreground">JN</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium text-foreground">Ján Novák</p>
          <p className="text-xs text-muted-foreground">Pro účet</p>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Settings className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-secondary">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default UserProfile;
