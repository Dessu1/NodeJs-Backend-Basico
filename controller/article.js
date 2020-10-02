"use strict";

var validator = require("validator");
var Article = require("../models/article");
var fs = require("fs");
var path = require("path");
const { constants } = require("buffer");

var controller = {
  datosCurso: (req, res) => {
    var hola = req.body.hola;
    return res.status(200).send({
      curso: "Master en frameworks js",
      estudiante: "Brian alvarado",
      url: "victorroblesweb.es",
      hola,
    });
  },

  test: (req, res) => {
    return res.status(200).send({
      message: "Soy la accion test de mi controlador de articulos",
    });
  },

  save: (req, res) => {
    //Recoger parametros por POST
    var params = req.body;

    // Validar datos (validator)
    try {
      var validate_title = !validator.isEmpty(params.title);
      var validate_content = !validator.isEmpty(params.content);
    } catch (err) {
      return res.status(200).send({
        status: "error",
        message: "Faltan datos por enviar",
      });
    }

    if (validate_title && validate_content) {
      // Crear el objeto a guardar
      var article = new Article();
      // Asignar valores
      article.title = params.title;
      article.content = params.content;
      article.image = null;
      // Guardar el articulo
      article.save((err, articleStored) => {
        if (err || !articleStored) {
          return res.status(404).send({
            status: "error",
            message: "El articulo no se ha guardado!!",
          });
        }
        // Devolver una respuesta
        return res.status(200).send({
          status: "sucess",
          article,
        });
      });
    } else {
      return res.status(200).send({
        status: "error",
        message: "Los datos no son validos",
      });
    }
  },

  getArticles: (req, res) => {
    var query = Article.find({});
    var last = req.params.last;
    if (last || last != undefined) {
      query.limit(5);
    }

    //Find
    query.sort("-_id").exec((err, articles) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: "Error al devolver los articulos",
        });
      }
      if (!articles) {
        return res.status(404).send({
          status: "error",
          message: "No hay articulos",
        });
      }

      return res.status(200).send({
        status: "sucess",
        articles,
      });
    });
  },

  getArticle: (req, res) => {
    // recoger id de la url
    var articleId = req.params.id;
    // Comprobar que existe
    if (!articleId || articleId == null) {
      return res.status(401).send({
        status: "error",
        message: "No existe el articulo",
      });
    }

    // Buscar el articulo
    Article.findById(articleId, (err, article) => {
      if (err || !article) {
        return res.status(404).send({
          status: "error",
          message: "No existe el articulo",
        });
      }

      // Devolver el articulo
      return res.status(200).send({
        status: "sucess",
        article,
      });
    });
  },

  update: (req, res) => {
    // Recoger id del articulo
    var articleId = req.params.id;

    // Recoger los datos por PUT
    var params = req.body;

    // Validar los datos
    try {
      var validate_title = !validator.isEmpty(params.title);
      var validate_content = !validator.isEmpty(params.content);
    } catch (err) {
      return res.status(200).send({
        status: "error",
        message: "Faltan datos por enviar",
      });
    }

    if (validate_title && validate_content) {
      // Find and update
      Article.findOneAndUpdate(
        { _id: articleId },
        params,
        { new: true },
        (err, articleUpdate) => {
          if (err) {
            return res.status(500).send({
              status: "error",
              message: "Error al actualizar",
            });
          }
          if (!articleUpdate) {
            return res.status(404).send({
              status: "error",
              message: "No exite el articulo",
            });
          }

          return res.status(200).send({
            status: "sucess",
            articleUpdate,
          });
        }
      );
    } else {
      // Devolver la respuesta
      return res.status(500).send({
        status: "error",
        message: "La validacion no es correcta",
      });
    }
  },

  delete: (req, res) => {
    // Recoger ID
    var articleId = req.params.id;
    // Find and delete
    Article.findOneAndDelete({ _id: articleId }, (err, articleRemoved) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: "Error al borrar",
        });
      }
      if (!articleRemoved) {
        return res.status(404).send({
          status: "error",
          message: "No se ha borrando el articulo, posiblemente no exista",
        });
      }
      return res.status(200).send({
        status: "sucess",
        article: articleRemoved,
      });
    });
  },

  upload: (req, res) => {
    // configurar el modulo connect multipary router/article.js (hecho)

    // Recoger el fichero de la peticion
    var file_name = "Imagen no subida...";

    if (!req.files) {
      return res.status(404).send({
        status: "error",
        message: file_name,
      });
    }
    // conseguir el nombre y la extension del archivo
    var file_path = req.files.file0.path;
    var file_split = file_path.split("\\");

    // * ADVERTENCIA * LINUX O MAC
    // var file_split = file_path.split("/");

    // comprobar la extension, solo imagenes, si no es valida borrar el finchero

    // nombre del archivo
    var file_name = file_split[2];

    // extension del arhivo
    var extension_split = file_name.split(".");

    var file_ext = extension_split[1];
    // si todo es valido

    if (
      file_ext != "png" &&
      file_ext != "jpg" &&
      file_ext != "gif" &&
      file_ext != "jpeg"
    ) {
      // borrar archivo
      fs.unlink(file_path, (err) => {
        return res.status(200).send({
          status: "error",
          message: "La extension de la imagen no es valida",
        });
      });
    } else {
      // update archivo
      var articleId = req.params.id;
      Article.findOneAndUpdate(
        { _id: articleId },
        { image: file_name },
        { new: true },
        (err, articleUpdated) => {
          if (err || !articleUpdated) {
            return res.status(200).send({
              status: "error",
              message: "Error al guardar la imagen del articulo",
            });
          }

          return res.status(200).send({
            status: "success",
            articleUpdated,
          });
        }
      );
    }
  },

  getImage: (req, res) => {
    var file = req.params.image;

    var path_file = "./upload/articles/" + file;

    // Verificar si existe
    fs.access(path_file, fs.constants.F_OK, (err) => {
      if (err) {
        return res.status(404).send({
          status: "error",
          message: "La imagen no existe",
        });
      } else return res.sendFile(path.resolve(path_file));
    });
  },

  search: (req, res) => {
    // sacar el string a buscar
    var searchString = req.params.search;

    // find or
    Article.find({
      // si el searchString esta contenido en el titulo o en el contenido, muestra el articulo
      $or: [
        { title: { $regex: searchString, $options: "i" } },
        { content: { $regex: searchString, $options: "i" } },
      ],
    })
      .sort([["date", "descending"]])
      .exec((err, articles) => {
        if (err) {
          return res.status(200).send({
            status: "error",
            message: "Error en la peticion",
          });
        }

        if (!articles || articles.length <= 0) {
          return res.status(404).send({
            status: "error",
            message: "No se ha encontrado nada",
          });
        }

        return res.status(200).send({
          status: "success",
          articles,
        });
      });
  },
};

module.exports = controller;
