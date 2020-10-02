"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// SE DEFINE LA ESTRUCTURA DE CADA UNO DE LOS ARTICULOS
var ArticleSchema = Schema({
  title: String,
  content: String,
  date: { type: Date, default: Date.now },
  image: String,
});

module.exports = mongoose.model("Article", ArticleSchema);
// articles --> guarda documentos de este tipo y con esta estructura dentro de la coleccion
