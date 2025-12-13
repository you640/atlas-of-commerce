import { Plus, Trash2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const apiKeys = [
  {
    id: 1,
    name: "Produkčný Kľúč 1",
    prefix: "ico_live_xxxxxxxx",
    created: "01.12.2024",
    status: "active",
  },
  {
    id: 2,
    name: "Testovací Kľúč",
    prefix: "ico_test_xxxxxxxx",
    created: "15.11.2024",
    status: "active",
  },
];

const ApiKeyManagement = () => {
  const handleCopy = (prefix: string) => {
    navigator.clipboard.writeText(prefix);
    toast.success("API kľúč skopírovaný do schránky");
  };

  return (
    <div className="glass rounded-xl p-5 border-t-2 border-t-primary/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Správa API Prístupu
        </h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-xs">
            <Plus className="h-3 w-3 mr-1" />
            Nový Kľúč
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {apiKeys.map((key) => (
          <div
            key={key.id}
            className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {key.name}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <code className="text-xs text-muted-foreground font-mono">
                  {key.prefix}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={() => handleCopy(key.prefix)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Vytvorené: {key.created}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-accent animate-blink" />
                <span className="text-xs text-accent">Aktívny</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-secondary hover:text-secondary hover:bg-secondary/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApiKeyManagement;
