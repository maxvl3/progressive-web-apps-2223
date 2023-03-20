const express = require('express')
const app = express()
const port = 3000

const { engine } = require("express-handlebars");
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use("/static", express.static("static"));

app.get('/', async (req, res) => {
    await fetch('https://www.rijksmuseum.nl/api/nl/collection?key=yLfBqOT3&p=1&ps=10')
    .then(res => res.json())
    .then(json => {
        const kunstwerken = json.artObjects;
        res.render("test", { kunstwerken });
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});