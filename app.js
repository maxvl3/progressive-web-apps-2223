const express = require('express')
const app = express()
const port = 3000

const { engine } = require("express-handlebars");
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use("/static", express.static("static"));

app.get('/', (req, res) => {
    res.render("test");
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});