/* Import Required Modules */
const express = require("express");
const router = express.Router();
const passport = require("passport");
const fs = require("fs");
const path = require("path");

/* Import Models */
const User = require("../models/User");
const Content = require("../models/Content");
const Event = require("../models/Event");
const Track = require("../models/Track");
const Video = require("../models/Video");
const Blogpost = require("../models/Blogpost");

/* Models Map */
const map = {
  User,
  Content,
  Event,
  Track,
  Video,
  Blogpost,
};

/* Fetch and Prepare Form Data */
const fetchFormData = (key, method = "", doc) => {
  /* Parse specfic key json */
  const formData = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../data/formData.json"), "utf8")
  )[key];

  /* Prepare formData based on method */
  switch (method.toLowerCase()) {
    case "post":
      formData.metadata.method = "POST";
      break;
    case "put":
      if (!doc) {
        console.error("error: doc is not defined");
        break;
      }
      formData.metadata.method = "PUT";
      formData.metadata.action += "/" + doc._id;
      /* Prepare formData based on model constructor */
      formData.metadata.saveAndAddNew = ["Content"].includes(
        doc.constructor.modelName
      )
        ? false
        : true;

      const body = JSON.parse(doc.body);

      formData.fields.forEach((field) => {
        switch (field.type) {
          case "hidden":
            // Do nothing
            break;
          case "file":
            field.file = body.file;
            break;
          default:
            field.value = body[field.name];
        }
      });
      break;
    default:
      break;
  }

  // Check on display name
  formData.metadata.display =
    formData.metadata.display ?? formData.metadata.name;

  return formData;
};

/* Import Auth Configs */
const { forwardAuthenticated } = require("../config/auth");
const { ensureAuthenticated } = require("../config/auth");

/* Simple Get Routes */
router.get("/", ensureAuthenticated, (req, res) => {
  res.render("admin/dashboard");
});

/* Content Model Put Routes */
const docs = [
  { name: "about" },
  { name: "music_page" },
  { name: "blog_page" },
  { name: "video_page" },
];

docs.forEach((doc) => {
  /* GET Edit Document Page */
  router.get("/" + doc.name, ensureAuthenticated, async (req, res) => {
    let options = {};

    const data = await Content.findOne({ name: doc.name });
    const formData = fetchFormData(doc.name, "put", data);

    options.doc = data;
    options.formData = formData;

    res.render("admin/static_document", options);
  });

  /* GET Document */
  router.get("/" + doc.name + "/:id", ensureAuthenticated, async (req, res) => {
    const doc = await Content.findById(req.params.id);
    res.json({
      success: true,
      doc,
    });
  });

  /* PUT Document */
  router.put("/" + doc.name + "/:id", ensureAuthenticated, async (req, res) => {
    try {
      const updatedDoc = await Content.findByIdAndUpdate(
        req.params.id,
        {
          body: JSON.stringify(req.body),
        },
        {
          new: true,
        }
      );
      res.json({
        success: true,
        updatedDoc,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Something went wrong",
      });
    }
  });
});

/* List Model Routes */
// Options:
// name: String (required) -- name of the route
// model: String (optional) -- name of the model
// content: Array (optional) -- additional content to be displayed on the page
const lists = [
  { name: "events" },
  { name: "tracks" },
  { name: "videos" },
  { name: "blogposts" },
];

const Model_Nomenclature = (string) => {
  return (
    string.slice(0, -1).charAt(0).toUpperCase() + string.slice(0, -1).slice(1)
  );
};

lists.forEach((list) => {
  /* Define Variables */
  const { name, model, content } = list;
  const Model = map[model || Model_Nomenclature(name)];

  /* Get Table of Complete Data Page*/
  router.get("/" + name, ensureAuthenticated, async (req, res) => {
    // Initialize variables
    let docs = [],
      options = {};

    if (content) {
      for (let i = 0; i < content.length; i++) {
        const data = await Content.findOne({ name: content[i] });
        docs.push(data);
      }
      options.content = docs;
    }

    const data = await Model.find({});
    const formData = fetchFormData(name);
    const tableData = { name, data, map: formData.metadata.map };

    options.tableData = tableData;

    res.render("admin/dynamic_list", options);
  });

  /* Get Add New Document Page */
  router.get("/" + name + "/new", ensureAuthenticated, (req, res) => {
    // Initialize variables
    let options = {};
    const formData = fetchFormData(name, "post");
    options.formData = formData;

    res.render("admin/operations/new", options);
  });

  /* Post New Document */
  router.post("/" + name, ensureAuthenticated, async (req, res) => {
    try {
      const newDoc = await Model.create({
        body: JSON.stringify(req.body),
      });
      res.json({
        success: true,
        newDoc,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Something went wrong",
      });
    }
  });

  /* Get Edit Document Page */
  router.get(
    "/" + name + "/:id/edit",
    ensureAuthenticated,
    async (req, res) => {
      // Initialize variables
      let options = {};

      const doc = await Model.findById(req.params.id);
      const formData = fetchFormData(name, "put", doc);
      options.doc = doc;
      options.formData = formData;
      res.render("admin/operations/edit", options);
    }
  );

  /* Get Document */
  router.get("/" + name + "/:id", ensureAuthenticated, async (req, res) => {
    const doc = await Model.findById(req.params.id);
    res.json({
      success: true,
      doc,
    });
  });

  /* Put Document */
  router.put("/" + name + "/:id", ensureAuthenticated, async (req, res) => {
    try {
      const updatedDoc = await Model.findByIdAndUpdate(
        req.params.id,
        {
          body: JSON.stringify(req.body),
        },
        {
          new: true,
        }
      );
      res.json({
        success: true,
        updatedDoc,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Something went wrong",
      });
    }
  });

  /* Delete Document */
  router.delete("/" + name + "/:id", ensureAuthenticated, async (req, res) => {
    try {
      const deletedDoc = await Model.findByIdAndDelete(req.params.id);
      res.json({
        success: true,
        deletedDoc,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Something went wrong",
      });
    }
  });
});

module.exports = router;
