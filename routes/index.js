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
  { path: 'about', data: { docs: ['about'] } },
  { path: 'music' },
  { path: 'videos', data: { lists: ['Video'] } },
  { path: 'blog', data: { lists: ['Blogpost'] } },
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

router.get('/blog/:slug', async (req, res) => {
  try {
    // Retrieve all posts
    const posts = await Blogpost.find();

    // Find the post with the matching slug
    const post = posts.find(p => JSON.parse(p.body).slug === req.params.slug);

    if (!post) {
      // If no post was found, redirect to /blog
      return res.redirect('/blog');
    }

    // Render the blog post and pass the post data
    res.render('client/blogpost', { data: post });
  } catch (error) {
    console.error('Error retrieving blog post:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
