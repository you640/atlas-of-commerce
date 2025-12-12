import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  cta: string;
}

const pricingTiers: PricingTier[] = [
  {
    name: "Free",
    price: "0 €",
    period: "/mesiac",
    description: "Základný prístup pre jednotlivcov",
    features: [
      "50 vyhľadávaní mesačne",
      "Základné firemné údaje",
      "IČO, DIČ, názov, adresa",
      "Status subjektu",
      "E-mailová podpora",
    ],
    cta: "Začať zadarmo",
  },
  {
    name: "Pro",
    price: "49 €",
    period: "/mesiac",
    description: "Pre profesionálov a malé tímy",
    features: [
      "Neobmedzené vyhľadávania",
      "Kompletné finančné údaje",
      "Štatutárne orgány a vzťahy",
      "Export do CSV/Excel",
      "API prístup (5 000 volaní)",
      "Prioritná podpora",
      "Monitoring zmien",
    ],
    popular: true,
    cta: "Vybrať Pro",
  },
  {
    name: "Enterprise",
    price: "Individuálne",
    period: "",
    description: "Pre veľké spoločnosti a integrácie",
    features: [
      "Všetko z Pro plánu",
      "Neobmedzené API volania",
      "Bulk export dát",
      "Dedikovaný account manager",
      "SLA 99.9% dostupnosť",
      "Vlastné integrácie",
      "On-premise riešenie",
      "Školenia a onboarding",
    ],
    cta: "Kontaktovať nás",
  },
];

const PricingCard = ({ tier, index }: { tier: PricingTier; index: number }) => (
  <div
    className={`relative flex flex-col p-8 rounded-xl transition-all duration-300 hover:-translate-y-2 ${
      tier.popular
        ? "gradient-border glow-shadow scale-105"
        : "border border-border/50 glass"
    }`}
    style={{ animationDelay: `${index * 0.1}s` }}
  >
    {tier.popular && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary to-secondary rounded-full text-sm font-semibold text-primary-foreground">
        Najpopulárnejší
      </div>
    )}

    <div className="mb-6">
      <h3 className="text-2xl font-bold text-foreground mb-2">{tier.name}</h3>
      <p className="text-muted-foreground text-sm">{tier.description}</p>
    </div>

    <div className="mb-8">
      <span className="text-4xl font-bold text-metallic">{tier.price}</span>
      <span className="text-muted-foreground">{tier.period}</span>
    </div>

    <ul className="flex-1 space-y-4 mb-8">
      {tier.features.map((feature) => (
        <li key={feature} className="flex items-start gap-3">
          <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center">
            <Check className="w-3 h-3 text-accent" />
          </div>
          <span className="text-foreground/80 text-sm">{feature}</span>
        </li>
      ))}
    </ul>

    <Button
      variant={tier.popular ? "primary" : "outline"}
      size="lg"
      className="w-full"
    >
      {tier.cta}
    </Button>
  </div>
);

const Pricing = () => {
  return (
    <div className="min-h-screen relative z-10">
      <Header />

      <main className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-metallic mb-4">
            Vyberte si plán podľa vašich potrieb
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Prístup k overených firemným dátam za transparentné ceny. Bez skrytých poplatkov.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <PricingCard key={tier.name} tier={tier} index={index} />
          ))}
        </div>

        <div className="mt-20 text-center">
          <p className="text-muted-foreground mb-4">
            Potrebujete individuálne riešenie?
          </p>
          <Button variant="outline" size="lg">
            Napíšte nám
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Pricing;
