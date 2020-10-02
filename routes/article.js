"use strict";

var express = require("express");
var ArticleController = require("../controller/article");

var multipart = require("connect-multiparty");
var md_upload = multipart({ uploadDir: "./upload/articles" });

var router = express.Router();
// RUTAS DE PRUEBAS
router.post("/datos-curso", ArticleController.datosCurso);
router.get("/test-de-controlador", ArticleController.test);

// RUTAS PARA ARTICULOS

// Enviar
router.post("/save", ArticleController.save);
//Subir archivos
router.post("/upload-image/:id", md_upload, ArticleController.upload);
// Sacar
router.get("/articles/:last?", ArticleController.getArticles);
router.get("/article/:id", ArticleController.getArticle);
router.get("/search/:search", ArticleController.search);
router.get("/get-image/:image", ArticleController.getImage);

// Actualizar
router.put("/article/:id", ArticleController.update);

// Borrar
router.delete("/article/:id", ArticleController.delete);

module.exports = router;
