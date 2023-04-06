# ArtFinder - Progressive webapp
In dit vak zal ik de client-side webapplicatie die ik heb gemaakt tijdens de Web App From Scratch omzetten naar een server-side webapplicatie. Ik voeg ook functionaliteiten toe gebaseerd op de Service Worker en maak de applicatie geschikt als Progressive Web App. Ten slotte zal ik een aantal optimalisaties implementeren om de prestaties van de applicatie te verbeteren.

<img width="1440" alt="Schermafbeelding 2023-04-06 om 02 00 46" src="https://user-images.githubusercontent.com/94384526/230244685-477b8381-030e-42a6-a5cb-bb50c6e8867d.png">


## Inhoudsopgave
- [Gebruikte technieken](https://github.com/maxvl3/progressive-web-apps-2223#gebruikte-technieken)
- [Installeren](https://github.com/maxvl3/progressive-web-apps-2223#installeren)
- [Activity diagram](https://github.com/maxvl3/progressive-web-apps-2223#activity-diagram)
- [Manifest.json](https://github.com/maxvl3/progressive-web-apps-2223#manifest.json)
- [Service worker](https://github.com/maxvl3/progressive-web-apps-2223#service-worker)
- [Critical Rendering Path](https://github.com/maxvl3/progressive-web-apps-2223#critical-rendering-path)

## Gebruikte technieken
- Node.js
- Express
- Body-parser
- Handlebars
- Compression
- Sass

## Installeren
1. Git clone
```
Git clone https://github.com/maxvl3/progressive-web-apps-2223.git
```

2. Install
```
npm install
```

3. Start
```
npm start
```

3. Watch
```
http://localhost:3000/
```

## Activity diagram
![activity](https://user-images.githubusercontent.com/94384526/230245369-81ddccfb-1549-4971-98f4-b222d909f51f.png)
![routes](https://user-images.githubusercontent.com/94384526/230245373-37bd75ee-9f91-4c77-b0c7-dbe9634989be.png)

## Manifest.json
Een manifest.json bestand is een configuratiebestand dat wordt gebruikt voor het beschrijven en definiëren van een webapplicatie of een browserextensie. Het bevat metadata zoals de naam, beschrijving, versie, pictogrammen en andere eigenschappen die nodig zijn om de applicatie of extensie correct te kunnen weergeven en functioneren in verschillende omgevingen en apparaten. Het manifest.json bestand wordt vaak gebruikt in combinatie met Progressive Web Apps en Chrome- en Firefox-extensies. Door het gebruik van een manifest.json bestand kan een ontwikkelaar eenvoudig de instellingen van de applicatie of extensie aanpassen en de gebruikerservaring verbeteren.

```
{
    "theme_color": "#9B6B50",
    "background_color": "#372C25",
    "display": "fullscreen",
    "scope": "/",
    "start_url": "/",
    "name": "ArtFinder",
    "short_name": "ArtFinder",
    "icons": [
        {
            "src": "/images/icon-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "/images/icon-256x256.png",
            "sizes": "256x256",
            "type": "image/png"
        },
        {
            "src": "/images/icon-384x384.png",
            "sizes": "384x384",
            "type": "image/png"
        },
        {
            "src": "images/icon-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ]
}
```

## Service worker
Een service worker is een scriptbestand dat als een proxy tussen de webapplicatie en de netwerklaag fungeert en een belangrijke rol speelt bij het implementeren van Progressive Web Apps. Het stelt ontwikkelaars in staat om webapplicaties offline te laten werken door het opslaan van webresources zoals HTML, CSS, JavaScript en media in de cache. Service workers kunnen ook worden gebruikt om pushmeldingen te verzenden, achtergrondtaken uit te voeren en de prestaties van de webapplicatie te verbeteren door middel van caching en prefetching. Service workers werken alleen met HTTPS-verbindingen en bieden een verbeterde gebruikerservaring door het bieden van snellere laadtijden en offline functionaliteit.

```
const CACHE_NAME = "my-site-cache-v1"; // De naam van de cache, deze kan worden gewijzigd bij updates van de site
const urlsToCache = [
  // Lijst van URL's die moeten worden opgeslagen in de cache
  "/",
  "/offline", // De fallback pagina die wordt weergegeven als de gebruiker offline is
];

self.addEventListener("install", function (event) {
  // Installatie van de service worker
  event.waitUntil(
    caches
      .open(CACHE_NAME) // Open de cache
      .then(function (cache) {
        console.log("Opened cache"); // Output naar de console
        return cache.addAll(urlsToCache); // Voeg de URL's toe aan de cache
      })
  );
});

self.addEventListener("activate", function (event) {
  // Activering van de service worker
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function (cacheName) {
            return (
              cacheName.startsWith("my-site-cache-") && // Verwijder alle caches behalve de huidige
              cacheName !== CACHE_NAME
            );
          })
          .map(function (cacheName) {
            return caches.delete(cacheName);
          })
      );
    })
  );
});

self.addEventListener("fetch", function (event) {
  // Fetch event listener
  event.respondWith(
    caches
      .match(event.request) // Zoek in de cache naar de aangevraagde bron
      .then(function (response) {
        // Cache hit - return response
        if (response) {
          // Als de bron in de cache wordt gevonden
          return response; // Geef de bron terug vanuit de cache
        }

        return fetch(event.request) // Als de bron niet in de cache is gevonden, haal de bron op van het internet
          .then(function (response) {
            // Check if we received a valid response
            if (
              !response ||
              response.status !== 200 ||
              response.type !== "basic"
            ) {
              // Als het antwoord niet geldig is
              return response; // Geef het ongeldige antwoord terug
            }

            // Clone the response
            var responseToCache = response.clone(); // Maak een kloon van het antwoord

            caches.open(CACHE_NAME).then(function (cache) {
              // Voeg de bron toe aan de cache
              cache.put(event.request, responseToCache);
            });

            return response;
          })
          .catch(function () {
            // Als er een fout optreedt bij het ophalen van de bron, gebruik de fallback pagina
            return caches.match("/offline");
          });
      })
  );
});
```

## Critical Rendering Path
1. Lazy loading

Lazy loading laadt alleen de zichtbare inhoud op een webpagina, waardoor de laadtijd wordt verminderd en de prestaties worden verbeterd door onnodige downloads te vermijden.

```
<img src="{{this.webImage.url}}" alt="" loading="lazy"/>
```

2. Afbeeldingen verkleinen

Verkleinde afbeeldingen verminderen de bestandsgrootte en verbeteren de laadtijd en de prestaties van de website, wat resulteert in een betere gebruikerservaring en SEO-score.

```
<a href="/artwork/{{this.objectNumber}}"><img
    src="{{this.webImage.url}}1000"
    alt=""
    loading="lazy"
/></a>
```

3. CSS en JS minify

HTML/CSS minify comprimeert de code door onnodige tekens zoals spaties, opmerkingen en regelovergangen te verwijderen om de bestandsgrootte te verminderen en de laadtijd van de website te verbeteren.

```
// Geen minify
body {
  font-size: 16px;
  color: #333333;
  background-color: #ffffff;
}

// Wel minify
body{font-size:16px;color:#333;background-color:#fff;}
```

4. Compression

Compression comprimeert bestanden zoals afbeeldingen, video's en audiobestanden om de bestandsgrootte te verminderen, de laadtijd te verbeteren en de overdrachtskosten te verminderen bij het verzenden via internet.

```
const compression = require("compression");
app.use(compression());
```
