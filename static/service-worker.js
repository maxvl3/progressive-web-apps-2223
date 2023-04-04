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
