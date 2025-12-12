import { Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const SearchBox = () => {
  return (
    <div className="relative w-full max-w-3xl gradient-border rounded-xl p-2 flex items-center shadow-lg glow-shadow">
      <Search className="w-6 h-6 text-primary ml-4 opacity-70" />
      <input
        type="text"
        placeholder="Zadajte IČO, názov firmy alebo priezvisko..."
        className="flex-1 bg-transparent border-none px-4 py-4 text-lg text-foreground font-montserrat outline-none placeholder:text-muted-foreground/60 placeholder:font-light"
      />
      <Button variant="search" size="xl" className="gap-3">
        <span className="hidden sm:inline">VYHĽADAŤ</span>
        <ArrowRight className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default SearchBox;
