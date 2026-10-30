# Atlas of Commerce

<!DOCTYPE html>
<html lang="sk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IČO ATLAS | Dáta o firmách na jeden klik</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <style>
        /* --- CSS Premenné a Globálne nastavenia --- */
        :root {
            /* Paleta farieb - Tmavý režim & Slovenská trikolóra */
            --bg-dark: #0a0e17; /* Hlboká obsidiánová */
            --bg-darker: #05070c;
            --primary-blue: #0056FF; /* Elektrická modrá */
            --primary-red: #FF3131; /* Neónová červená */
            --text-silver: #e0e0e0;
            --text-white: #ffffff;
            --accent-green: #00ff9d; /* Pre status "Aktívny" */

            /* Glassmorphism efekty */
            --glass-bg: rgba(255, 255, 255, 0.05);
            --glass-border: rgba(255, 255, 255, 0.1);
            --backdrop-blur: blur(12px);

            /* Gradienty */
            --metallic-gradient: linear-gradient(135deg, #e0e0e0 0%, #ffffff 50%, #a0a0a0 100%);
            --blue-red-gradient: linear-gradient(90deg, var(--primary-blue), var(--primary-red));
            --glow-shadow: 0 0 20px rgba(0, 86, 255, 0.3), 0 0 40px rgba(255, 49, 49, 0.2);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Montserrat', sans-serif;
            background-color: var(--bg-dark);
            color: var(--text-silver);
            overflow-x: hidden;
            min-height: 100vh;
            /* Komplexné pozadie: Hlboký vesmír + kybernetické lúče */
            background-image: 
                radial-gradient(circle at 50% 30%, rgba(0, 86, 255, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(255, 49, 49, 0.1) 0%, transparent 40%),
                linear-gradient(to bottom, var(--bg-darker), var(--bg-dark));
        }

        /* Kybernetický vzor na pozadí (voliteľné - jemná textúra) */
        body::before {
            content: '';
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0h-2.828zM60 54.627l-.828.83-1.415-1.415L60 51.8v2.827zM0 5.373l.828-.83L2.243 5.96 0 8.2V5.374zM0 48.97l3.657 3.657 1.414-1.414L0 46.143v2.828zM60 11.03l-3.657-3.657 1.414 1.414L60 13.857V11.03zM54.627 60l.83-.828-1.415-1.415L51.8 60h2.827zM5.373 60l-.83-.828L5.96 57.757 8.2 60H5.374zM48.97 60l3.657-3.657-1.414 1.414L46.143 60h2.828zM11.03 60L7.372 56.343 8.787 54.93 13.857 60h-2.828zM60 5.373l-.828-.83-1.415 1.415L60 8.2V5.374zM0 54.627l.828.83L2.243 54.04 0 51.8v2.827z' fill='%23ffffff' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E");
            pointer-events: none;
            z-index: -1;
        }

        /* --- HLAVIČKA (Header) --- */
        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem 3rem;
            border-bottom: 1px solid var(--glass-border);
            backdrop-filter: var(--backdrop-blur);
            position: sticky;
            top: 0;
            z-index: 100;
        }

        .logo-container img {
            height: 50px;
            /* Jemná pulzujúca animácia svetla */
            animation: logoPulse 4s infinite ease-in-out;
            filter: drop-shadow(0 0 8px rgba(0, 86, 255, 0.5));
        }

        nav ul {
            display: flex;
            list-style: none;
            gap: 2rem;
        }

        nav a {
            text-decoration: none;
            color: var(--text-white);
            font-weight: 500;
            font-size: 0.95rem;
            position: relative;
            padding: 5px 0;
            transition: color 0.3s;
        }

        /* Efekt podčiarknutia pri hoveri */
        nav a::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0;
            height: 2px;
            background: var(--primary-blue);
            transition: width 0.3s ease;
        }

        nav a:hover::after,
        nav a.active::after {
            width: 100%;
        }

        .header-buttons {
            display: flex;
            gap: 1rem;
        }

        .btn {
            padding: 0.8rem 1.5rem;
            border-radius: 4px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        /* Sekundárne tlačidlo - kovový obrys */
        .btn-outline {
            background: transparent;
            border: 2px solid rgba(255, 255, 255, 0.3);
            color: var(--text-silver);
            position: relative;
            overflow: hidden;
        }

        .btn-outline:hover {
            border-color: var(--text-white);
            box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
        }

        /* Primárne tlačidlo - modro-červený gradient */
        .btn-primary {
            background: var(--blue-red-gradient);
            border: none;
            color: var(--text-white);
            box-shadow: var(--glow-shadow);
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 0 30px rgba(0, 86, 255, 0.5), 0 0 50px rgba(255, 49, 49, 0.3);
        }

        /* --- HERO SEKCIA --- */
        .hero-section {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 6rem 2rem 2rem;
            position: relative;
        }

        /* Strieborný nadpis s kovovým efektom */
        .hero-title {
            font-size: 3.5rem;
            font-weight: 900;
            margin-bottom: 1rem;
            background: var(--metallic-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0px 4px 10px rgba(0,0,0,0.3);
        }

        .hero-subtitle {
            font-size: 1.2rem;
            color: var(--text-silver);
            max-width: 700px;
            margin-bottom: 4rem;
            opacity: 0.9;
        }

        /* --- CENTRÁLNY VYHĽADÁVACÍ MODUL (Futuristický) --- */
        .search-container {
            position: relative;
            width: 100%;
            max-width: 800px;
            /* Glassmorphism pozadie */
            background: var(--glass-bg);
            backdrop-filter: var(--backdrop-blur);
            border-radius: 12px;
            padding: 8px;
            display: flex;
            align-items: center;
            /* Žiariaci okraj pomocou gradientu */
            border: 2px solid transparent;
            background-image: linear-gradient(var(--bg-dark), var(--bg-dark)), 
                              linear-gradient(135deg, var(--primary-blue), var(--primary-red));
            background-origin: border-box;
            background-clip: padding-box, border-box;
            box-shadow: 0 10px 30px -10px rgba(0, 86, 255, 0.3);
            z-index: 10;
        }

        .search-icon {
            font-size: 1.5rem;
            color: var(--primary-blue);
            margin-left: 15px;
            opacity: 0.7;
        }

        .search-input {
            flex-grow: 1;
            background: transparent;
            border: none;
            padding: 1rem 1.5rem;
            font-size: 1.2rem;
            color: var(--text-white);
            font-family: 'Montserrat', sans-serif;
            outline: none;
        }

        .search-input::placeholder {
            color: rgba(255, 255, 255, 0.5);
            font-weight: 300;
        }

        .search-btn {
            padding: 1rem 2.5rem;
            border-radius: 8px;
            font-size: 1.1rem;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        /* --- INTERAKTÍVNA UKÁŽKA VÝSLEDKOV (Data Card Preview) --- */
        .data-card-preview {
            margin-top: 3rem;
            width: 100%;
            max-width: 800px;
            /* Glassmorphism + Kovové rámovanie */
            background: rgba(10, 14, 23, 0.8);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-top: 2px solid rgba(0, 86, 255, 0.5); /* Modrý horný akcent */
            border-radius: 12px;
            padding: 2rem;
            position: relative;
            overflow: hidden;
            box-shadow: 0 20px 40px -20px rgba(0,0,0,0.5);
            animation: slideUp 0.8s ease-out forwards;
            opacity: 0;
            transform: translateY(30px);
        }

        /* Hologramový scanline efekt */
        .data-card-preview::after {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; height: 5px;
            background: linear-gradient(90deg, transparent, rgba(0, 86, 255, 0.4), transparent);
            animation: scanline 4s linear infinite;
            opacity: 0.3;
            pointer-events: none;
        }

        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid var(--glass-border);
        }

        .company-title {
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--text-white);
            margin-bottom: 0.5rem;
        }

        .company-ico {
            color: var(--primary-blue);
            font-weight: 600;
            letter-spacing: 1px;
        }

        .status-indicator {
            display: flex;
            align-items: center;
            gap: 8px;
            background: rgba(0, 255, 157, 0.1);
            padding: 6px 12px;
            border-radius: 20px;
            border: 1px solid rgba(0, 255, 157, 0.3);
        }

        .status-dot {
            width: 10px; height: 10px;
            background-color: var(--accent-green);
            border-radius: 50%;
            box-shadow: 0 0 10px var(--accent-green);
            animation: blink 2s infinite;
        }

        .status-text {
            color: var(--accent-green);
            font-size: 0.9rem;
            font-weight: 600;
        }

        /* Grid pre dátové bloky */
        .card-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
        }

        .data-block h4 {
            font-size: 0.9rem;
            color: rgba(255, 255, 255, 0.6);
            text-transform: uppercase;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .data-block h4 i { color: var(--primary-blue); }

        .data-value {
            font-size: 1.1rem;
            color: var(--text-silver);
            font-weight: 500;
        }

        .finance-item {
            margin-bottom: 1rem;
        }

        .finance-value {
            font-size: 1.3rem;
            font-weight: 700;
            color: var(--text-white);
        }

        .trend-up { color: var(--accent-green); font-size: 0.9rem; margin-left: 5px; }

        /* Jednoduchá vizualizácia sparkline grafu (CSS only) */
        .sparkline-container {
            display: flex;
            align-items: flex-end;
            height: 30px;
            gap: 4px;
            margin-top: 5px;
            opacity: 0.7;
        }
        .spark-bar {
            width: 6px;
            background: var(--primary-blue);
            border-radius: 2px;
        }
        .spark-bar.red { background: var(--primary-red); }

        .executive-list {
            list-style: none;
        }
        
        .executive-list li {
            margin-bottom: 0.8rem;
            position: relative;
            padding-left: 15px;
        }

        /* Žiariace čiary prepojenia */
        .executive-list li::before {
            content: '';
            position: absolute;
            left: 0; top: 50%;
            width: 8px; height: 2px;
            background: var(--primary-red);
            box-shadow: 0 0 5px var(--primary-red);
        }

        .card-corner-btn {
            position: absolute;
            bottom: 0;
            right: 0;
            background: var(--glass-border);
            padding: 0.8rem 1.2rem;
            font-size: 0.8rem;
            color: var(--text-white);
            text-decoration: none;
            border-top-left-radius: 12px;
            transition: background 0.3s;
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .card-corner-btn:hover {
            background: var(--primary-blue);
        }

        /* --- ANIMÁCIE --- */
        @keyframes logoPulse {
            0%, 100% { filter: drop-shadow(0 0 5px rgba(0, 86, 255, 0.4)); }
            50% { filter: drop-shadow(0 0 12px rgba(255, 49, 49, 0.4)); }
        }

        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        @keyframes scanline {
            0% { top: 0; }
            100% { top: 100%; }
        }

        @keyframes slideUp {
            to { opacity: 1; transform: translateY(0); }
        }

        /* --- RESPONZIVITA --- */
        @media (max-width: 768px) {
            header { padding: 1rem; }
            nav ul { display: none; /* Pre jednoduchosť skryté na mobile */ }
            .hero-title { font-size: 2.2rem; }
            .card-grid { grid-template-columns: 1fr; }
            .search-btn span { display: none; } /* Skryť text tlačidla na mobile */
            .search-btn { padding: 1rem; }
        }
    </style>
</head>
<body>

    <header>
        <div class="logo-container">
            <img src="logo.png" alt="IČO ATLAS Logo - Luxusný 4D Glóbus">
        </div>
        <nav>
            <ul>
                <li><a href="#" class="active">Funkcie</a></li>
                <li><a href="#">Cenník</a></li>
                <li><a href="#">API Dokumentácia</a></li>
                <li><a href="#">O nás</a></li>
            </ul>
        </nav>
        <div class="header-buttons">
            <button class="btn btn-outline">Prihlásiť sa</button>
            <button class="btn btn-primary">Vyskúšať zadarmo</button>
        </div>
    </header>

    <main class="hero-section">
        <h1 class="hero-title">Kompletný obraz o slovenských firmách.</h1>
        <p class="hero-subtitle">Získajte overené finančné a právne dáta v reálnom čase. Rýchlo, presne a cez API.</p>

        <div class="search-container">
            <i class="fas fa-search search-icon"></i>
            <input type="text" class="search-input" placeholder="Zadajte IČO, názov firmy alebo priezvisko...">
            <button class="btn btn-primary search-btn">
                <span>VYHĽADAŤ</span>
                <i class="fas fa-arrow-right"></i>
            </button>
        </div>

        <div class="data-card-preview">
            <div class="card-header">
                <div>
                    <h2 class="company-title">ESET, spol. s r.o.</h2>
                    <span class="company-ico">IČO: 31333532</span>
                </div>
                <div class="status-indicator">
                    <div class="status-dot"></div>
                    <span class="status-text">Aktívny subjekt</span>
                </div>
            </div>

            <div class="card-grid">
                <div class="data-block">
                    <h4><i class="fas fa-map-marker-alt"></i> Sídlo</h4>
                    <p class="data-value">Einsteinova 24<br>851 01 Bratislava</p>
                </div>

                <div class="data-block">
                    <h4><i class="fas fa-chart-line"></i> Financie (2023)</h4>
                    <div class="finance-item">
                        <div class="finance-value">589 mil. € <span class="trend-up"><i class="fas fa-arrow-up"></i> rast</span></div>
                        <div class="sparkline-container">
                            <div class="spark-bar" style="height: 40%"></div>
                            <div class="spark-bar" style="height: 60%"></div>
                            <div class="spark-bar" style="height: 50%"></div>
                            <div class="spark-bar" style="height: 80%"></div>
                            <div class="spark-bar" style="height: 100%"></div>
                        </div>
                    </div>
                    <div class="finance-item">
                        <div class="finance-value" style="font-size: 1.1rem; color: var(--text-silver);">Zisk: 85 mil. € <span class="trend-up"><i class="fas fa-arrow-up"></i> rast</span></div>
                        <div class="sparkline-container">
                            <div class="spark-bar red" style="height: 30%"></div>
                            <div class="spark-bar red" style="height: 50%"></div>
                            <div class="spark-bar red" style="height: 70%"></div>
                            <div class="spark-bar red" style="height: 60%"></div>
                            <div class="spark-bar red" style="height: 90%"></div>
                        </div>
                    </div>
                </div>

                <div class="data-block">
                    <h4><i class="fas fa-users"></i> Štatutárny orgán</h4>
                    <ul class="executive-list">
                        <li>Ing. Miroslav Trnka</li>
                        <li>Rudolf Hrubý</li>
                        <li>Maroš Grund</li>
                    </ul>
                </div>
            </div>

            <a href="#" class="card-corner-btn">
                Zobraziť úplný profil & vzťahy <i class="fas fa-external-link-alt"></i>
            </a>
        </div>
    </main>

</body>
</html>


Hlavný popis:
Sofistikovaný, ultra-moderný frontend webovej stránky (landing page a vyhľadávacie rozhranie) pre SaaS službu "IČO ATLAS". Celkový dizajn je v prémiovom tmavom režime (dark mode) s pozadím v hlbokých odtieňoch obsidiánovej a námorníckej modrej, pretkávaný jemnými, žiariacimi kybernetickými obvodmi a geometrickými vzormi v slovenskej trikolóre (elektrická modrá, neónová červená, biela/strieborná), ktoré korešpondujú s estetikou loga v image_4.png. Rozhranie pôsobí high-tech, dôveryhodne a je zamerané na rýchlosť a dáta.
​Štruktúra a Elementy:
​Hlavička (Header & Navigácia):
​V ľavom hornom rohu je umiestnené animované 3D logo "IČO ATLAS" presne ako v image_4.png (kovová modro-červená sféra s ozubeným kolesom a strieborný text). Logo jemne pulzuje svetlom.
​Vedľa loga je minimalistická navigácia s bielym, bezpätkovým písmom: "Funkcie", "Cenník", "API Dokumentácia", "O nás". Aktívna položka má jemné modré podčiarknutie.
​V pravom hornom rohu sú dve tlačidlá s kovovým odleskom: sekundárne "Prihlásiť sa" (obrys) a primárne "Vyskúšať zadarmo" (plné tlačidlo s gradientom modrej a červenej farby).
​Hero Sekcia (Hlavná časť):
​Dominantný nadpis v strede obrazovky, veľkým, tučným strieborným písmom: "Kompletný obraz o slovenských firmách."
​Podnadpis pod ním, menším bielym písmom: "Získajte overené finančné a právne dáta v reálnom čase. Rýchlo, presne a cez API."
​Centrálny Vyhľadávací Modul: Obrovské, futuristicky dizajnované vyhľadávacie pole uprostred. Má jemne žiariaci modro-červený okraj a efekt skla (glassmorphism). Vnútri je ikona lupy a placeholder text: "Zadajte IČO, názov firmy alebo priezvisko...". Vpravo v poli je výrazné tlačidlo "VYHĽADAŤ" s integrovanou ikonou šípky.
​Interaktívna Ukážka Výsledkov (Data Card Preview):
​Priamo pod vyhľadávacím poľom sa zobrazuje "ukážková karta" výsledku, akoby používateľ práve niečo vyhľadal (napr. "ESET, spol. s r.o.").
​Táto karta je detailný, štruktúrovaný dátový panel s kovovým rámovaním a jemným hologramovým efektom.
​Obsah karty:
​Hlavička karty: Názov firmy "ESET, spol. s r.o." (veľké), IČO: 31333532, Status: "Aktívny subjekt" (so svietiacou zelenou bodkou).
​Dátové bloky (Grid): Rozdelené do sekcií s malými ikonami:
​Adresa: Einsteinova 24, Bratislava.
​Financie (s malými sparkline grafmi): Tržby: 589 mil. € (↑ rast), Zisk: 85 mil. € (↑ rast).
​Štatutári: Zoznam mien prepojený tenkými žiariacimi čiarami (napr. "Ing. Miroslav Trnka").
​V rohu karty je malé tlačidlo "Zobraziť úplný profil & vzťahy".
​Pozadie a Atmosféra:
​Pozadie nie je len čierne, je to hlboký digitálny priestor. Jemné svetelné lúče v modrej a červenej farbe vychádzajú z centrálneho loga a vyhľadávacieho poľa, čím vytvárajú pocit hĺbky a digitálnej konektivity. Celkový dojem je čistý, luxusný a technologicky pokročilý.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://ico-insight.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/afe03bb1-6ecd-4898-81dc-34f6bcf89bc7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
