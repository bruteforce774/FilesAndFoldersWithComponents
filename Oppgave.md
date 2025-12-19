# Emne 2 og 3 \- Obligatorisk oppgave

| Innleveringsfrist | Fredag 27.06.2025 kl. 8.00 |
| :---- | :---- |
| Krav for bestått | For å bestå oppgaven må du score bedre enn 40% |
| Innlevering | Last opp zip-fil med kode og tekstdokument til Google Drive og del med Terje. Zip-fil navngis med studentnummer. Ikke ha med navn. Tekstdokument kan være ren tekst, word eller pdf. |

Oppgaven er basert på en liten applikasjon for filer og mapper laget i Vanilla JavaScript med web komponenter, og en hjelpefunksjon for å opprette slike: 
- [github.com/GetAcademy/FilesAndFoldersWithComponents](https://github.com/GetAcademy/FilesAndFoldersWithComponents)

Applikasjonen kan testes direkte her:
- [getacademy.github.io/FilesAndFoldersWithComponents](https://getacademy.github.io/FilesAndFoldersWithComponents)

## Oppgave 1 \- kode \- Oversett til Vue og TypeScript \- 50%

Krav: 

* Vue-applikasjonen skal ha de samme komponentene som koden har i utgangspunktet \- og applikasjonen skal være helt lik som utgangspunktet i utseende og oppførsel.   
* Oversett til **strict** TypeScript, og samle alle datatyper i en egen fil, types.ts. Det er ikke lov å bruke any, med mindre det følges av en kommentar som forklarer hvorfor det er den beste løsningen.   
* Bruk, så langt det er mulig, samme struktur som i utgangspunktet.   
* Flytt applikasjonens tilstand til en Pinia store. All endring av applikasjonens tilstand skal også skje her. Komponentene *kan* ha egen brukergrensesnitt tilstand, denne kan leve og endres direkte i komponentene.   
* Bruk composition API syntaks både i Vue og Pinia  
* Det er kun en side/ett view, fileBrowser. Denne komponenten er den eneste som aksesserer pinia store. Alle andre komponenter får data via props og sender ut endringer som emits. Komponenten fileBrowser skal ha minimalt med logikk, og mest fokus på rendering. Logikken flyttes til actions i Pinia, og tilstanden i Pinia store skal ikke endres direkte fra fileBrowser.   
* Lag tre enhetstester som sjekker funksjonaliteten som i frameworkless-applikasjonen var i `getViewState` i `model.js` - men som nå flyttes inn i en Pinia store. 

## Oppgave 2 \- tekst \- 50%

Svar på spørsmålene under. Teksten på denne oppgaven skal være på 1 200 ord (+/- 10%).

1. Beskriv og forklar originalapplikasjonen. Hvilket design pattern benyttes for tilstandshåndtering?  
2. For hvert av elementene under i originalapplikasjonen, forklar hva de erstattes av i Vue-applikasjonen  
   1. `defineComponent` i `framework.js`
   2. `assignPropsBySelector` i `framework.js`
   3. `subscribe` i `model.js`
   4. controller-funksjonene i `model.js`, dvs. de funksjonene som endrer applikasjonens tilstand og varsler om endringen  
   5. `getViewState` i `model.js`
3. Hva er virtuell DOM og diff algoritme?  
4. Hvordan benyttes virtuell DOM og diff-algoritme i et SPA-rammeverk?  
5. Forklar med ord hvordan du ville lagt inn virtuell DOM og diff-algoritme i originalapplikasjonen uten å benytte deg av et rammeverk.

## Tips 

* Start med å forstå originalkoden. Bruk litt tid på å lese og utforske hvordan komponenter og tilstand samspiller i frameworkless-versjonen før du begynner å oversette.  
* Gjør én ting av gangen. Start for eksempel med å oversette fileBrowser og bare en av de andre komponentene \- og se at det virker før du fortsetter. Pinia store kan du godt utsette.   
* Lag testene dine tidlig. Du forstår funksjonen getViewState bedre når du tester den, og det hjelper deg også med å validere strukturen din i Pinia.  
* En god løsning ikke trenger å være perfekt – men strukturert, konsistent og forståelig.  
* Det er lov og forventet at du gjenbruker CSS og HTML mest mulig fra originalen.  
* Ikke vent til siste dagen med å skrive\! Start skrivingen etter at du har kodet litt. Da starter du en modningsprosess som fortsetter mens du gjør andre ting. 
