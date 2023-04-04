// Importeer de express-module en initialiseer de app
const express = require("express");
const app = express();

// Stel de poort in waarnaar geluisterd moet worden
const port = 3000;

// Performance upgrade doormiddel van compressie
const compression = require("compression");
app.use(compression());

// Importeer de body-parser-module voor het verwerken van de request body
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Importeer de express-handlebars-module als view engine
const { engine } = require("express-handlebars");
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

// Stel de map in waarin statische bestanden zich bevinden
app.use(express.static("static"));

// Definieer een endpoint om het manifest-bestand te serveren
app.get("/manifest.json", (req, res) => {
  res.sendFile(__dirname + "/manifest.json");
});

// Definieer de homepagina en haal data op van de Rijksmuseum API
app.get("/", async (req, res) => {
  await fetch(
    "https://www.rijksmuseum.nl/api/nl/collection?key=yLfBqOT3&involvedMaker=Rembrandt+van+Rijn&p=1&ps=10"
  )
    .then((res) => res.json())
    .then((json) => {
      const kunstwerken = json.artObjects;
      res.render("home", { kunstwerken });
    });
});

// Definieer een endpoint voor de detailpagina van een kunstwerk en haal data op van de Rijksmuseum API
app.get("/artwork/:objectNumber", async (req, res) => {
  await fetch(
    "https://www.rijksmuseum.nl/api/nl/collection?key=yLfBqOT3&q=" +
      req.params.objectNumber
  )
    .then((res) => res.json())
    .then((json) => {
      const kunstwerk = json.artObjects;
      res.render("detail", { kunstwerk });
    });
});

// Definieer een endpoint voor de zoekfunctie en haal data op van de Rijksmuseum API
app.post("/search", async (req, res) => {
  await fetch(
    "https://www.rijksmuseum.nl/api/nl/collection?key=yLfBqOT3&imgonly=true&ps=20&s=relevance&q=" +
      req.body.input
  )
    .then((res) => res.json())
    .then((json) => {
      const searchresult = json.artObjects;
      res.render("search", { searchresult, searchinput: req.body.input });
    });
});

// Definieer een offline pagina
app.get("/offline", (req, res) => {
  res.render("offline");
});

// Start de server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
