# Postup práce na projektu StreamHub

## Důležité pokyny pro AI
- Vždy dodržuj designy v daných složkách (pokud nejsou dáno jinak)
- Vždy odpovídej v Češtině
- **POZOR:** Nepředělávej design ani komponenty podle sebe, pokud k tomu nemáš můj výslovný souhlas.
- Můžeš navrhnout úpravu nebo vylepšení, ale nejdřív se mě zeptej, jestli s tím souhlasím a čekej na mou odpověď.
- Vždy po dokončení úpravy otestuj funkčnost aplikace a ujisti se, že funguje správně.
- Vždy si přečti celé zadání a pochop ho, než začneš pracovat.
- Vždy si přečti zadání **dvakrát**, abys pochopil všechny detaily a souvislosti.
- Vždy si **poznamenej do tohoto souboru**, co už jsi udělal, abys věděl, co máš dělat dál.
- Vždy zkontroluj svůj kód jestli splňuje všechny pokyny, které jsi dostal.
- Vždy zkontroluj tento soubor před tím, než začneš pracovat a ujisti se, že jsi neporušil žádné pokyny.
- **POZOR:** Nikdy si sám nevytvářej soubory v podsložkách, které nejsou specifikovány v zadání. Vždy se drž striktně existující struktury. Pokud si myslíš, že by bylo vhodné vytvořit nový soubor nebo podsložku, vždy se nejprve zeptej a čekej na schválení.
- 

## 1. Fáze: Analýza a Plánování
1. Zkontroloval jsem obsah složky `images`, která obsahuje 9 obrázků designu.
2. Otevřel jsem a prohlédl si klíčové obrázky (`katalog.png`, `katalog-detail-filmu.png`, `seznamy.png`, `statistiky.png`), abych lépe porozuměl požadovanému designu:
   - Zjistil jsem, že se jedná o velmi tmavý design s hlavní barvou pozadí okolo `#0a0a0f` a sekundárními sekcemi (jako karty a modální okna) s mírně světlejšími odstíny.
   - Hlavní rozložení se skládá z postranního menu (Sidebar) s položkami Katalog, Seznamy, Statistiky a Nastavení.
   - Horní lišta (TopBar) obsahuje vyhledávání a ikonu uživatelského profilu.
   - Uvědomil jsem si, že "Katalog" není typický grid karet, ale elegantní tabulkové zobrazení (seznam) titulů, kde každý řádek obsahuje zmenšený poster, název s kulatým `+` tlačítkem pro přidání do seznamu, rok vydání, žánry, hodnocení zobrazené pomocí hvězdiček a dostupné streamovací služby reprezentované barevnými badge štítky.
   - Po kliknutí na titul se otevře stylový modal s detaily a s velkým posterem na levé straně.
   - Stránka statistik je osazena vizuálně atraktivním donut chartem a kartami se shrnutím pro konkrétní období.
3. Ověřil jsem, zda je dostupné `npm` příkazem `npm --version`, protože to budu potřebovat pro vytvoření Vite projektu.
4. Připravil jsem strukturální plán, ve kterém navrhuji použití knihoven jako `lucide-react`, `recharts`, a `react-router-dom`. Plán byl předložen uživateli k odsouhlasení, abychom měli jistotu, že můžeme bezpečně inicializovat Vite a začít s generováním samotných souborů.

*Čekám na schválení plánu od uživatele.*

## 2. Fáze: Implementace
1. Inicializoval jsem projekt pomocí šablony Vite a nainstaloval všechny potřebné závislosti, konkrétně nejnovější Tailwind CSS v4, knihovny pro UI (lucide-react, recharts) a globální stav (zustand).
2. Upravil jsem konfiguraci `vite.config.ts` a zavedl Tailwind V4 styly do `index.css` a to včetně specifických barevných proměnných z designových podkladů a tmavého scrollbaru.
3. Navrhnul jsem a implementoval model pro mockovou databázi (`usersDb.ts`) a předvytvořil demo katalog s cca 30 filmy, generovaným posterem, herci, popisy a metadaty.
4. Napsal jsem rozsáhlý `useAppStore` postavený nad Zustand, který si ukládá stav (seznamy, přihlášení a hodnocení) perzistentně do `localStorage` a správně rozlišuje různé uživatelské relace.
5. Postupně jsem implementoval komponenty dle specifikace v pořadí: Layout (Sidebar/TopBar) -> Autentizační brány (Login/Register/Recovery) -> Katalog (MovieGrid a modální detaily) -> Správa seznamů -> Datové statistiky.
6. Narazil jsem na chybějící typy a neshody v TS konfiguraci (`verbatimModuleSyntax`). Vše jsem úspěšně naladil a otestoval funkčnost buildu aplikace, který nyní probíhá bez chyby.

Aplikace je nyní hotová, prozkoumána a postavená plně v Reactu. Designové parametry včetně barev, flexibilních interakcí, a modálních oken přesně kopírují screenshoty. Vše bylo sestaveno do funkčního SPA pomocí moderních nástrojů.

## 3. Fáze: Vylepšení UI/UX podle nových návrhů
1. **Přepracování stránky Seznamy** — Původní jednoduchý výpis filmů jsem přebudoval na zobrazení krabiček (karet), kde každá krabička reprezentuje jeden seznam. Po kliknutí na krabičku se uživatel „ponoří" dovnitř a vidí tabulkový výpis filmů (stejný layout jako v Katalogu). Systémový seznam „Přehrát později" nemá tři tečky, protože by nemělo smysl ho mazat ani přejmenovávat. Uživatelské seznamy mají v pravém horním rohu tři tečky s menu pro přejmenování (prompt dialog) a smazání (s potvrzením přes confirm).
2. **Popover profilu v TopBaru** — Do pravého horního rohu na ikonu profilu jsem napojil plovoucí popover. Zobrazuje uživatelské jméno a e-mail aktuálně přihlášeného uživatele a tlačítko „Odhlásit se". Popover se zavře kliknutím kamkoliv mimo něj (click outside handler přes useEffect + ref).
3. **Pokročilé filtrování v Katalogu** — Staré `<select>` tagy jsem nahradil vlastní komponentou `Dropdown.tsx` (multiselect s fajfkami). Služby filtrují logiku OR (film stačí mít na jedné vybrané), žánry filtrují logiku AND (film musí mít všechny vybrané). Katalog navíc zobrazuje pouze filmy dostupné na uživatelových předplatných. Při aktivním filtru se objeví tlačítko „Zrušit filtry".
4. **Detail filmu — tlačítka služeb** — Místo jednoho velkého tlačítka a textu „Také na:" se nyní dynamicky generují tlačítka pro každou službu. Vlastněné služby svítí plnou barvou, nevlastněné jsou zašedlé a neklikatelné.
5. **Oprava Zustand selektorů** — Selektory vracející `[] || []` vytvářely nové reference při každém renderu, což způsobovalo nekonečnou smyčku. Opraveno tak, že celý objekt se vytáhne selektorem a fallback se vyhodnotí v těle komponenty.

## 4. Fáze: Opravy a přejmenování
1. **Přejmenování Voyo → Oneplay** — Služba Voyo přestala existovat, nahrazena službou Oneplay. Přepsal jsem všechny zmínky ve všech souborech: `catalog.ts` (typ ServiceType + data), `MovieCard.tsx`, `MovieDetail.tsx`, `StatsView.tsx`, `SettingsView.tsx`.
2. **Filtry jen pro vlastněné služby** — Dropdown „Služby" nyní nabízí pouze služby, které uživatel reálně vlastní (ne celý katalog služeb). Dropdown „Žánry" nabízí pouze žánry filmů, jež jsou na uživatelových službách dostupné. Úvaha: nemá smysl ukazovat filtr pro službu, kterou uživatel nemá — stejně by neviděl žádné výsledky. Obdobně žánry, které se nenachází na žádném dostupném filmu, by byly matoucí.
3. **Oprava pozice tlačítka „+"** — Tlačítko `AddToPlaylistButton` bylo umístěno uvnitř sloupce ROK, takže se zobrazovalo pod nadpisem „ROK" vedle čísla roku. Přesunul jsem ho do sloupce TITULY za název filmu. Přidal jsem `shrink-0` na obrázek a tlačítko, aby se název správně ořezával přes `truncate` a neposouvalo se rozvržení ostatních sloupců.
4. **Zalamování názvu filmu** — Na kontejner titulů přidán `min-w-0`, který je klíčový pro správné fungování `truncate` uvnitř flex kontejneru (bez něj se flex potomek může neomezeně roztáhnout a pushovat ostatní sloupce gridu).

## 5. Fáze: Doplnění funkcionality
1. **Tlačítko „O aplikaci"** — Do spodní části postranní lišty (Sidebar) jsem přidal tlačítko s ikonou `Info`. Po kliknutí se otevře modální okno (popup) s informacemi o aplikaci: popis, verze, použité technologie, jméno tvůrce a studijní číslo. Modal se zavírá křížkem nebo kliknutím na overlay. Uvažování: Tlačítko je umístěno dole, aby nenarušovalo navigační sekci nahoře a vizuálně oddělilo informační akci od navigace po stránkách.
2. **Funkční „Změnit heslo"** — V Nastavení bylo tlačítko „Změnit heslo" dosud nefunkční (jen vizuální placeholder). Nyní po kliknutí otevře modální okno se dvěma vstupními poli: „Nové heslo" a „Potvrďte nové heslo". Validace: heslo musí mít alespoň 4 znaky a obě pole se musí shodovat. Po úspěšné změně se zobrazí zelená fajfka s potvrzením a modal se po 1,5 sekundě automaticky zavře. Heslo se aktualizuje přes existující funkci `usersDb.updatePassword()`. Při zavření modalu se všechna pole a chybové hlášky resetují.

## 6. Fáze: Předělání accent barvy z fialové na červenou
1. **Úvaha:** Uživatel si přeje, aby veškeré zvýraznění v aplikaci odpovídalo barvě loga (červená `#dc2626` = Tailwind `red-600`). Původní accent barva byla fialová (`#7c3aed`). Musel jsem projít všechny komponenty a identifikovat, kde se fialová používá jako accent (interakce, hover, focus, checkboxy, tlačítka) vs. kde se jedná o barvu služby HBO Max (tu jsem ponechal).
2. **CSS proměnné** (`index.css`): `--color-primary` změněna z `#7c3aed` na `#dc2626`, `--color-primary-hover` z `#6d28d9` na `#b91c1c`.
3. **TopBar**: Focus border na search baru + aktivní border ikony profilu.
4. **Autentizace** (`LoginForm.tsx`, `RegisterForm.tsx`, `ForgotPasswordForm.tsx`): Všechna submit tlačítka, focus bordery inputů a navigační linky (Zaregistrujte se, Přihlaste se, Zapomenuté heslo).
5. **Katalog** (`AddToPlaylistButton.tsx`): Hover border na „+" tlačítku, checkboxy u přidávání do seznamu, focus na input pro nový seznam.
6. **Nastavení** (`SettingsView.tsx`): Hover bordery na tlačítkách Změnit heslo/Ochrana soukromí, border a glow aktivních předplatných, checkmark kolečka, focus inputů v modalu hesla, submit tlačítko modalu.
7. **Seznamy** (`PlaylistsView.tsx`): Hover barva názvu krabiček.
8. **Neměněno:** Barva služby HBO Max v `StatsView.tsx` (řádek 8) — ta je oprávněně fialová, protože reprezentuje značku HBO Max, nikoliv accent aplikace.

## 7. Fáze: Oprava statistik a layoutu
1. **Prázdný stav statistik** — Když uživatel nemá žádnou historii sledování (`history.length === 0`), místo prázdného grafu se nyní zobrazí karta s ikonou grafu, nadpisem „Zatím žádná data" a vysvětlujícím textem, že graf nemůže být vygenerován, protože uživatel zatím neviděl žádný film. Zároveň jsem opravil hardcoded procenta a text „+ 12 % oproti minulému období" na dynamicky počítané hodnoty z reálných dat.
2. **Zmenšení padding-top** — TopBar měl výšku `h-20` (80px), což způsobovalo velkou mezeru mezi search barem a obsahem stránky. Změněno na `h-14` (56px) pro kompaktnější layout bez zbytečného scrollování.

## 8. Fáze: Responsivita a vyhledávání
1. **Skrytí/zobrazení sidebaru** — Sidebar se automaticky skrývá na obrazovkách menších než 1024px. Na mobilu se zobrazuje hamburger menu tlačítko v TopBaru, které sidebar vysune přes obsah s overlay pozadím. Sidebar se zavírá křížkem, kliknutím mimo nebo výběrem položky.
2. **Responsivní katalog** — Na malých obrazovkách se v tabulce katalogu skryjí sloupce Typ, Žánr a Hodnocení, zůstane jen obrázek s názvem a dostupnost.
3. **Responsivní statistiky** — Graf a informační karty se na mobilech zobrazují pod sebou. Filtr časového období se zalamuje místo vodorovného scrollování.
4. **Funkční vyhledávání** — Search bar v TopBaru je nyní funkční. Od 3 znaků se začne filtrovat katalog podle názvu filmu/seriálu. Pokud uživatel hledá z jiné stránky, automaticky se přesměruje do katalogu. Zobrazí se informační lišta s počtem výsledků a tlačítkem pro zrušení hledání. Pokud nic neodpovídá, zobrazí se zpráva „nenalezeno". Vyhledávání funguje společně s ostatními filtry (typ, služby, žánry).
5. **Rozšíření bloků nastavení** — Odstraněno omezení `max-w-4xl` v `SettingsView.tsx`, aby sekce profilu a předplatných zabíraly celou dostupnou šířku stránky.
6. **Sjednocení responsivity tabulek** — V detailech seznamů (`PlaylistsView.tsx`) byla implementována stejná logika skrývání sloupců jako v katalogu, což zajišťuje konzistentní chování aplikace na malých obrazovkách.
7. **Přejmenování Amazon Prime Video → Prime Video** — Zkrácen název služby ve všech částech aplikace (data, filtry, tlačítka, statistiky) pro lepší čitelnost a úsporu místa v UI.
8. **Oprava ořezávání „Přidat do seznamu"** — Odstraněno `overflow-hidden` z hlavních kontejnerů tabulek i z wrapperů řádků. To vyřešilo problém, kdy se vyskakovací okno ořezávalo o hranu posledního řádku. Zaoblení rohů tabulky bylo zachováno aplikováním `rounded-t-xl` na hlavičku a `rounded-b-xl` přímo na poslední komponentu `MovieCard`.
9. **Rozšíření MovieCard** — Komponenta `MovieCard` nyní přijímá `className`, což umožňuje flexibilní stylování (např. zaoblení rohů) v různých částech aplikace bez nutnosti omezujících wrapperů s `overflow-hidden`.
