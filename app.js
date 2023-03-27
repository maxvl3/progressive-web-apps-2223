const express = require('express');
const app = express();
const port = 3000;

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const { engine } = require("express-handlebars");
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(express.static("static"));

app.get('/', async (req, res) => {
    await fetch('https://www.rijksmuseum.nl/api/nl/collection?key=yLfBqOT3&involvedMaker=Rembrandt+van+Rijn&p=1&ps=10')
    .then(res => res.json())
    .then(json => {
        const kunstwerken = json.artObjects;
        res.render("home", { kunstwerken });
    })
});

app.get('/artwork/:objectNumber', async (req, res) => {
  await fetch('https://www.rijksmuseum.nl/api/nl/collection?key=yLfBqOT3&q=' + req.params.objectNumber)
    .then(res => res.json())
    .then(json => {
        const kunstwerk = json.artObjects;
        res.render("detail", { kunstwerk });
    })
});

app.post("/search", async (req, res) => {
  await fetch('https://www.rijksmuseum.nl/api/nl/collection?key=yLfBqOT3&q=' + req.body.input)
  .then(res => res.json())
  .then(json => {
      const searchresult = json.artObjects;
      res.render("search", { searchresult });
  })
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});