# Voortgang en volgende stappen

## Inspectie — 3 november 2026

Repository `pimdas/vilmos` bevatte alleen README.md en één initiële commit. De lokale map was leeg. De gekoppelde Railway-workspace bevatte geen Vilmos-project. Eerdere chats beschrijven het Studio-concept en de huisstijl, maar bevatten geen implementatie.

## Fase 1 — lokale werkruimte

Geïmplementeerd: projecten, briefingchat, uploads, configureerbaar sjabloon, afgeschermde preview, zelfstandige HTML-export en projectback-up. Geen externe runtimepakketten, externe fonts, tracking of AI-aanroepen. Een kleine Node-server maakt dezelfde app lokaal en later op Railway bruikbaar.

Deze fase bewijst de werkstroom. Chatopdrachten worden nog niet automatisch uitgevoerd. Browseropslag is tijdelijk, voor deze eerste versie.

## Gekozen vervolgstap — handmatige overdracht

De eigenaar koos voorlopig voor bouwen via de bestaande ontwikkelchat, zonder betaalde AI-API. De Studio biedt nu een overdrachtdialoog met kopieerbare briefing en een ZIP met originele bijlagen, projectback-up en eventueel concept.html. Het pakket maakt geen externe verbinding en verstuurt niets automatisch.

## Fase 2 — AI-aansturing afstemmen

Keuze: handmatige overdracht naar de bestaande ontwikkelomgeving, of automatische generatie via een apart geprijsde model-API. Er is geen leverancier vastgelegd. Automatische generatie vereist server-side geheimen, projectgerichte context, limieten op uitvoer en aanvragen en een afdwingbaar budget. Vermijd onbeperkte hergeneratie van volledige repositories.

Bepaal ook of de Studio alleen voor de eigenaar is of voor klanten. Dat bepaalt toegangscontrole en projectrechten.

## Fase 3 — duurzaam opslaan en publiceren

- Accounts en serveropslag voor projecten, berichten en uploads.
- GitHub-integratie met minimale repositoryrechten; sleutels uitsluitend server-side.
- Railway voor de Studio zelf. Conceptpublicatie na keuze tussen één gedeelde conceptserver voor statische sites of aparte diensten voor websites met eigen servergedrag.
- Domeinbeheer, validatie van projectnamen en isolatie van gegenereerde websites. Plaats onbetrouwbare uitvoer nooit onder dezelfde oorsprong als de Studio.
- Hosting- en modelkosten zichtbaar en begrensd voordat automatische publicatie beschikbaar komt.

Geen nieuwe betaalde diensten, AI-sleutels of domeinwijzigingen zijn geconfigureerd.

## Toon van vilmos.nl

Persoonlijk en kleinschalig: websites maken uit liefhebberij, plezier in techniek en daarmee kleine ondernemers helpen. Vermijd grote bureauclaims en beloften over onbeperkte beschikbaarheid. De website is op deze toon herschreven.

## Portfolio

Op verzoek toegevoegd: echoconsult.nl en vanroosmalen-zijlstra.nl. Twee projectkaarten met screenshots van de openbare homepages, korte beschrijvingen en externe links. Geen claims over resultaat, doorlooptijd of specifieke technische werkzaamheden. Screenshots zijn vastgelegd op 3 november 2026.
