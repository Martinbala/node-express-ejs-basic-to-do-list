// Importa los módulos necesarios
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

// Inicializa la aplicación Express
const app = express();

// Configura EJS como el motor de plantillas
app.set('view engine', 'ejs');

// Usa el middleware body-parser para manejar datos de formularios en solicitudes POST
app.use(bodyParser.urlencoded({ extended: true }));

// Sirve archivos estáticos desde el directorio 'public'
app.use(express.static("public"));

// Almacena las tareas en Map en lugar de Array para mejor manipulación
const items = new Map();
const workItems = new Map();

// Añade algunas tareas iniciales al Map
items.set('1', 'Buy Food');
items.set('2', 'Cook Food');
items.set('3', 'Eat Food');

// Ruta para la página principal
app.get("/", function (req, res) {
  const day = date.getDate();
  const itemList = Array.from(items, ([uid, text]) => ({ uid, text }));
  res.render("list-map", { listTitle: day, newListItems: itemList });
});

// Manejador para añadir nuevas tareas
app.post("/", function (req, res) {
  const itemText = req.body.newItem;
  const listName = req.body.listName;
  const uid = Date.now().toString();

  if (listName === "Work") {
    workItems.set(uid, itemText);
    res.redirect("/work");
  } else {
    items.set(uid, itemText);
    res.redirect("/");
  }
});

// Ruta para la lista de trabajo
app.get("/work", function (req, res) {
  const itemList = Array.from(workItems, ([uid, text]) => ({ uid, text }));
  res.render("list-map", { listTitle: "Work", newListItems: itemList });
});

// Manejador para eliminar tareas
app.post("/delete", function (req, res) {
  const uidToDelete = req.body.uid;
  const listName = req.body.listName;

  if (listName === "Work") {
    workItems.delete(uidToDelete);
    res.redirect("/work");
  } else {
    items.delete(uidToDelete);
    res.redirect("/");
  }
});

// Ruta para la página 'about'
app.get("/about", function (req, res) {
  res.render("about");
});

// Inicia el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log("Server started on port", PORT);
});

