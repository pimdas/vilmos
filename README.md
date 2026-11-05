# Vilmos Studio

Eigen werkruimte voor websitebriefings en eerste concepten, in donkergroen, crème en warm oranje. Versie 0.1 werkt zonder externe pakketten en zonder AI-API.

## Starten

Node.js 22 of hoger. Geen installatie van pakketten nodig.

```sh
npm start
```

Open http://localhost:3000. De omgevingsvariabele `PORT` kan de poort aanpassen. Controles: `npm test`.

## Functionaliteit

- Projecten maken, selecteren en verwijderen.
- Briefings bewaren in een chatinterface. Antwoorden zijn vaste uitleg; geen AI-generatie.
- PNG/JPEG/WebP en TXT/Markdown uploaden: 2 MB per bestand, 20 bestanden en 4 MB gecodeerde inhoud per project.
- Koptekst, introductie, actieknop, e-mailadres en accentkleur aanpassen.
- Sjabloonconcept bekijken op desktop- en mobiele breedte. Het eerste beeld wordt als logo gebruikt. Briefings en tekstbijlagen worden nog niet automatisch verwerkt.
- Website downloaden als zelfstandige HTML met ingebed logo.
- Projecten inclusief berichten en bijlagen exporteren/importeren als JSON.
- Via **Verder bouwen in je chat** een complete briefing kopiëren of één ZIP downloaden met briefing, originele bestanden, projectback-up en eventueel het sjabloonconcept. Pak de ZIP uit en voeg briefing en bijlagen toe aan je ontwikkelchat. Er wordt niets automatisch verzonden.

Projecten staan uitsluitend in localStorage van deze browser en oorsprong. Het quotum verschilt per browser; bij volle opslag verschijnt een melding en blijft exporteren mogelijk. Er is geen synchronisatie, account of serveropslag. Exporteer belangrijke projecten als back-up. Voeg toegangscontrole en serveropslag toe voor online beheer van vertrouwelijk klantwerk.

## Railway

`railway.json` bevat startcommando en gezondheidscontrole. De server gebruikt `PORT` en luistert op `0.0.0.0`. Er is niets gepubliceerd of aan een domein gekoppeld. Deze repository is publiek: zet geen sleutels, klantbestanden of projectexports in Git.

Zie [docs/ROADMAP.md](docs/ROADMAP.md) voor de volgende keuzes. Automatische AI-generatie, GitHub-koppeling vanuit de Studio en publicatie op subdomeinen zijn nog niet geïmplementeerd.

## Website voor vilmos.nl

De eerste bedrijfswebsite is lokaal te bekijken op http://localhost:3000/vilmos. Bronbestanden staan in `public/website/`. De Studio blijft op `/` beschikbaar. De website bevat diensten, werkwijze, veelgestelde vragen en contact via info@vilmos.nl. Het formulier bereidt een e-mail voor in het eigen mailprogramma; er is geen server die berichten verstuurt of bewaart. De website is nog niet gepubliceerd. Het beeldmerk is een voorlopige SVG-uitwerking van de gekozen richting. Voor publicatie de bedrijfsgegevens en teksten controleren en bepalen welke site op de hoofdroute wordt aangeboden.

## Publicatie

De Docker-container bevat uitsluitend de bedrijfswebsite en start met `SITE_MODE=website`. Op `/` opent de Vilmos-website; Studio-routes en projectbestanden worden niet geserveerd. Lokaal blijft `npm start` de Studio op `/` en de website op `/vilmos` openen.

GitHub: https://github.com/pimdas/vilmos. Railway volgt de branch `main`; pushes naar deze branch publiceren de website opnieuw. Controleer wijzigingen eerst lokaal. Websitepublicatie gebruikt geen betaalde AI-API. Hosting valt onder het Railway-account.

## Studio starten met een project

De Studio volgt het Vilmos-brandbook en toont drie stappen: briefing, materiaal en overdracht naar de ontwikkelchat. Bij Nieuw project kun je direct een eerste briefing opslaan. De overdrachtknop staat in een afzonderlijk paneel onder de projectinstellingen. De Studio blijft lokaal en browseropslag wordt niet naar GitHub of Railway verzonden.

## Lokale ontwerpverkenning — Taste, Impeccable en React Bits

De website gebruikt React Bits TiltedCard als progressieve verbetering van de portfolioafbeeldingen. Alleen op desktop met een fijne aanwijzer en zonder verminderde beweging worden React-eilanden geladen; inhoud, links, formulier en mobiele afbeeldingen blijven gewone HTML. Bron: https://github.com/DavidHDev/react-bits (licentie bewaard in `src/website/react-bits/LICENSE.md` en `public/website/react-bits-license.txt`).

Na wijzigingen aan `src/website/`: `npm run build:website`. De gegenereerde `public/website/effects.js` en `effects.css` moeten bij de websitebestanden blijven; de bestaande Docker-publicatie serveert deze bestanden rechtstreeks. De lokale proefversie staat op `/vilmos`. Publicatie van de goedgekeurde versie verloopt via de branch `main` naar Railway.
