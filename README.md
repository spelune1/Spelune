# Pivovar Rudohor – objednávková kalkulačka

Statická PWA aplikace určená pro GitHub Pages. Po prvním načtení přes HTTPS si aplikace ukládá aplikační shell do cache a může se otevřít offline.

## Nasazení na GitHub Pages
1. Vytvořte na GitHubu nový repository (např. `rudohor-app`).
2. Nahrajte do kořenové složky repository všechny soubory z tohoto balíčku (`index.html`, `sw.js`, `manifest.webmanifest`, `icon.svg`, `README.md`).
3. Repository → **Settings → Pages**.
4. V sekci Build and deployment nastavte **Deploy from a branch**, vyberte `main` a `/ (root)`, potvrďte.
5. Otevřete publikovanou HTTPS adresu. První spuštění musí proběhnout online, aby se aplikace a dostupné knihovny uložily.

## Offline a omezení
- Offline režim funguje po prvním úspěšném načtení a instalaci cache, na HTTPS (GitHub Pages) nebo localhost.
- Kamera pro EAN skenování potřebuje podporu prohlížeče a oprávnění; v offline režimu nemusí fungovat, pokud knihovna nebyla dostupná při prvním online načtení.
- Export PDF a čárové kódy využívají externí knihovny z CDN, které se Service Worker pokusí při instalaci cache uložit. Offline použitelnost těchto funkcí závisí na tom, zda se knihovny podařilo uložit.
- Data aplikace se ukládají lokálně v zařízení/prohlížeči; tento balíček nepřidává synchronizaci mezi zařízeními.
