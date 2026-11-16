PIVOVAR RUDOHOR – OFFLINE VERZE PRO GITHUB PAGES

CO NAHRÁT NA GITHUB
Nahrajte VŠECHNY soubory z této složky do stejné složky repozitáře,
ze které GitHub Pages publikuje web:
- index.html
- sw.js
- manifest.webmanifest
- rudohor-icon.svg

DŮLEŽITÉ PRVNÍ SPUŠTĚNÍ
1. Otevřete GitHub Pages adresu s funkčním internetem.
2. Počkejte několik sekund, než se stránka načte a Service Worker uloží
   aplikaci a dostupné knihovny do cache.
3. Stránku jednou obnovte (F5 / Ctrl+R) stále s internetem.
4. Potom odpojte internet a znovu otevřete stejnou GitHub Pages adresu.
   Kalkulačka by měla zobrazit produkty a umožnit tvořit objednávky.

POZNÁMKY
- Offline režim funguje jen přes HTTPS (GitHub Pages HTTPS podporuje).
- První návštěva musí proběhnout online. Samotný Service Worker nemůže
  uložit web do zařízení, pokud jej zařízení nikdy online nenačetlo.
- Každé zařízení a každý prohlížeč má vlastní archiv objednávek.
- Vytváření objednávek, výpočty a archiv jsou lokální; odeslání e-mailu,
  WhatsAppu nebo otevření externích služeb vyžaduje internet.
- Skenování kamerou závisí na podpoře prohlížeče a povolení kamery.
- PDF, QR a čárové kódy používají uložené knihovny. Pokud některou CDN
  knihovnu nelze při prvním spuštění stáhnout, příslušná funkce nemusí být
  v offline režimu dostupná; v konzoli prohlížeče se zobrazí upozornění.
- Při aktualizaci aplikace zvyšte CACHE_VERSION v souboru sw.js (např. v2),
  aby se nová verze uložila do cache.

ZACHOVÁNO
- Data produktů a ceny z dodaného index.html.
- Stránkování PDF po 10 položkách (pokud je v dodaném souboru nastaveno).
- Ukládání archivu do úložiště prohlížeče.
