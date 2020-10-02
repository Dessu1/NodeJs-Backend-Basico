"use strict";

var mongoose = require("mongoose");
var app = require("./app");
var port = 3900;

// Desactivar metodos antiguos para solo trabajar con los nuevos
mongoose.set("useFindAndModify", false);
// Buena configuracion para mongoose internamente
mongoose.Promise = global.Promise;
// CONEXION A MONGODB   --> mongoose.connect(URL, opciones)(()=>{});
mongoose
  .connect("mongodb://localhost:27017/api_rest_blog", { useNewUrlParser: true })
  .then(() => {
    console.log("La conexion a la base de datos se realizo correctamente!!");

    // Crear servidor y ponerlo a escuchar peticiones
    app.listen(port, () => {
      console.log("Servidor corriendo en http://localhost:" + port);
    });
  });
