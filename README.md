# Návod na spuštění aplikace StreamHub
## Prerekvizity
K běhu aplikace je nutné mít nainstalované prostředí **Node.js** (ideálně verze 18 a novější) a správce balíčků **npm**.

## Spuštění vývojového serveru
1. Otevřete příkazovou řádku a přejděte do kořenového adresáře projektu.
2. Nainstalujte všechny potřebné závislosti příkazem:
   ```bash
   npm install
   ```
3. Po dokončení instalace spusťte vývojový server příkazem:
   ```bash
   npm run dev
   ```
4. Do konzole se vypíše lokální adresa, na které aplikace běží (nejčastěji `http://localhost:5173/`).

## Stažení dat z TMDB (getMovies.py)
Součástí projektu je také Python skript `Dokumentace/getMovies.py`, který slouží k naplnění (nebo aktualizaci) lokální databáze filmů a seriálů. Skript asynchronně komunikuje s The Movie Database (TMDB) API a stahuje relevantní data o titulech dostupných na lokálních streamovacích službách v ČR.

**Požadavky pro spuštění skriptu:**
* Nainstalovaný **Python 3.7+**.
* Nainstalovaná knihovna `aiohttp` pro asynchronní HTTP požadavky (`pip install aiohttp`).

**Jak skript funguje:**
* Vyhledává nejlépe hodnocené filmy a seriály globálně, ale i specificky pro Českou republiku.
* Pro každý titul zjišťuje dostupnost na lokálních platformách (Netflix, HBO Max, atd.), hodnocení, žánry, herce a délku (runtime/epizody).
* Po dokončení uloží všechna strukturovaná data do souboru `src/app/data/complete_tmdb_data.json`, odkud si je React aplikace načítá jako svůj katalog.
