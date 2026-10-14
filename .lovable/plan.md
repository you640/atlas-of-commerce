# Diagnostika: prečo nefunguje vyhľadávanie IČO

## Zistená príčina

Aplikácia je v poriadku — problém je v externom API. Overené priamym testom:

- `http://localhost:8080/api/proxy-search?ico=31333532` → timeout 60 s, HTTP 000 (žiadna odpoveď)
- `https://icoatlas.sk/api/company/proxy-search?ico=31333532` (priamo, bez proxy) → timeout 15 s, HTTP 000

Server `icoatlas.sk` momentálne neodpovedá. Dnes ráno (pri testovaní debug módu) ešte fungoval — odpovedal za 774 ms so statusom 200. Ide teda o výpadok/nedostupnosť upstream API, nie o chybu v kóde aplikácie.

V aplikácii sa to prejaví tak, že po 12 sekundách (náš AbortController timeout) sa zobrazí „Chyba siete: Časový limit požiadavky vypršal (12 s)."

## Plán

1. **Overiť stav upstream API** — zopakovať test o pár minút; ak API opäť odpovedá, vyhľadávanie začne fungovať bez zásahu.
2. **Zlepšiť chybovú hlášku pri nedostupnosti API** — v `searchCompany` rozlíšiť timeout/nedostupnosť servera a zobraziť zrozumiteľnejšiu správu, napr. „Služba je momentálne nedostupná, skúste to neskôr." namiesto technickej „Chyba siete: ...". UI layout sa nemení.
3. **Diagnostika zostáva** — stránka `/diagnostic` a debug panel (🧪) slúžia na overenie, keď sa API vráti.

## Technické detaily

- Zmena len v `src/lib/search-company.ts` (vetva `network_error` / timeout) a prípadne text hlášky v `HeroSection.tsx`.
- Žiadne zmeny layoutu, štýlov ani proxy konfigurácie vo `vite.config.ts`.
- Fixture režim v debug paneli umožňuje testovať UI aj počas výpadku API.
