import SearchBox from "./SearchBox";
import DataCardPreview from "./DataCardPreview";

const HeroSection = () => {
  return (
    <main className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-16 lg:py-24">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-metallic mb-4 leading-tight">
        Kompletný obraz o slovenských firmách.
      </h1>
      <p className="text-lg text-silver opacity-90 max-w-2xl mb-12">
        Získajte overené finančné a právne dáta v reálnom čase. Rýchlo, presne a cez API.
      </p>

      <SearchBox />
      <DataCardPreview />
    </main>
  );
};

export default HeroSection;
