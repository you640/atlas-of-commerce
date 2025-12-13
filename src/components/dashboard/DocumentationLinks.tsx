import { FileText, Package, Activity, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import StatsCard from "./StatsCard";

const links = [
  { icon: FileText, text: "Interaktívna API Dokumentácia (Swagger)", href: "#" },
  { icon: Package, text: "Postman Kolekcia", href: "#" },
  { icon: Activity, text: "Stav Systému", href: "#", status: "online" },
];

const codeSnippet = `curl -X GET "https://api.icoatlas.sk/v1/company/31333532" \\
  -H "Authorization: Bearer ico_live_xxxx"`;

const DocumentationLinks = () => {
  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeSnippet);
    toast.success("Kód skopírovaný do schránky");
  };

  return (
    <StatsCard title="Dokumentácia a Nástroje" glowColor="primary">
      <div className="space-y-3 mb-4">
        {links.map((link, index) => (
          <a
            key={index}
            href={link.href}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors group"
          >
            <link.icon className="h-4 w-4 text-primary group-hover:text-primary" />
            <span className="text-sm text-foreground group-hover:text-primary transition-colors">
              {link.text}
            </span>
            {link.status && (
              <span className="ml-auto flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-accent animate-blink" />
                <span className="text-xs text-accent">Online</span>
              </span>
            )}
          </a>
        ))}
      </div>

      {/* Code Snippet */}
      <div className="relative">
        <pre className="bg-background-darker p-4 rounded-lg text-xs font-mono text-muted-foreground overflow-x-auto">
          <code>{codeSnippet}</code>
        </pre>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-7 w-7"
          onClick={handleCopyCode}
        >
          <Copy className="h-3.5 w-3.5" />
        </Button>
      </div>
    </StatsCard>
  );
};

export default DocumentationLinks;
