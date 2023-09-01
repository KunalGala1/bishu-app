const express = require('express');
const router = express.Router();

/* Import Models */
const User = require('../models/User');
const Content = require('../models/Content');
const Event = require('../models/Event');
const Video = require('../models/Video');
const Blogpost = require('../models/Blogpost');

/* Models Map */
const map = {
  User,
  Content,
  Event,
  Video,
  Blogpost,
};

const pages = [
  {
    path: '',
    name: 'index',
    data: {
      docs: ['about'],
      lists: ['Video', 'Blogpost'],
    },
  },
  { path: 'about' },
  { path: 'music' },
  { path: 'videos' },
  { path: 'blog' },
];

pages.forEach(page => {
  router.get(`/${page.path}`, async (req, res) => {
    let data = {};

    if (page.data) {
      // Fetching lists of documents
      if (page.data.lists) {
        for (const modelName of page.data.lists) {
          if (map[modelName]) {
            data[modelName] = await map[modelName].find();
          }
        }
      }

      // Fetching specific document by name
      if (page.data.docs) {
        for (const docName of page.data.docs) {
          const doc = await Content.findOne({ name: docName }); // Assuming 'name' is the field you want to search by in the Content model.
          if (doc) {
            data[docName] = doc;
          }
        }
      }
    }

    res.render(`client/${page.name || page.path}`, { data });
  });
});

module.exports = router;
