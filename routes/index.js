const express = require("express");
const router = express.Router();

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

const pages = [
  {
    path: "",
    name: "index",
    data: {
      docs: ["about", "contact"],
      lists: ["Track", "Video"],
    },
  },
  { path: "about", data: { docs: ["about"] } },
  { path: "music", data: { lists: ["Track"], docs: ["music_page"] } },
  { path: "videos", data: { lists: ["Video"], docs: ["video_page"] } },
  { path: "blog", data: { lists: ["Blogpost"], docs: ["blog_page"] } },
  { path: "contact", data: { docs: ["contact"] } },
];

pages.forEach((page) => {
  router.get(`/${page.path}`, async (req, res) => {
    let data = {};

    const nav = await Content.findOne({ name: "nav" });
    data.nav = nav;

    if (page.data) {
      // Fetching lists of documents
      if (page.data.lists) {
        if (page.name === "index") {
          const homePageDoc = await Content.findOne({ name: "home" });
          const featuredTrack = await Track.findById(
            JSON.parse(homePageDoc.body).featuredTrack
          );
          const featuredVideo = await Video.findById(
            JSON.parse(homePageDoc.body).featuredVideo
          );
          data.featuredTrack = featuredTrack;
          data.featuredVideo = featuredVideo;
        } else {
          for (const modelName of page.data.lists) {
            if (map[modelName]) {
              data[modelName] = await map[modelName].find();
            }
          }
        }
      }

      // Fetching specific document by name
      if (page.data.docs) {
        for (const docName of page.data.docs) {
          const doc = await Content.findOne({ name: docName });
          if (doc) {
            data[docName] = doc;
          }
        }
      }
    }

    res.render(`client/${page.name || page.path}`, { data });
  });
});

router.get("/blog/:slug", async (req, res) => {
  let data = {};
  const nav = await Content.findOne({ name: "nav" });
  data.nav = nav;
  try {
    // Retrieve all posts
    const posts = await Blogpost.find();

    // Find the post with the matching slug
    const post = posts.find((p) => JSON.parse(p.body).slug === req.params.slug);

    if (!post) {
      // If no post was found, redirect to /blog
      return res.redirect("/blog");
    }

    data.post = post;

    // Render the blog post and pass the post data
    res.render("client/blogpost", { data });
  } catch (error) {
    console.error("Error retrieving blog post:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
