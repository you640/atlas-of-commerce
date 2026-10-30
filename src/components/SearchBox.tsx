import { Search, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading?: boolean;
}

const SearchBox = ({ value, onChange, onSubmit, loading }: SearchBoxProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      onSubmit();
    }
  };

  return (
    <div className="relative w-full max-w-3xl gradient-border rounded-xl p-2 flex items-center shadow-lg glow-shadow">
      <Search className="w-6 h-6 text-primary ml-4 opacity-70" />
      <input
        type="text"
        placeholder="Zadajte IČO firmy..."
        aria-label="IČO firmy"
        className="min-w-0 w-0 flex-1 bg-transparent border-none px-4 py-4 text-lg text-foreground font-montserrat outline-none placeholder:text-muted-foreground/60 placeholder:font-light"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <Button
        variant="search"
        size="xl"
        className="gap-3 shrink-0"
        aria-label="Vyhľadať"
        onClick={onSubmit}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <span className="hidden sm:inline">VYHĽADAŤ</span>
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </Button>
    </div>
  );
};

export default SearchBox;
