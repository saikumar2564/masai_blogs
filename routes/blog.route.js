const express = require("express");
const { blogmodel } = require("../models/blog");
const { authentication } = require("../middleware/authentication.middleware");
const blogRoute = express.Router();
require("dotenv").config();

blogRoute.post("/blogs", authentication, async (req, res) => {
  try {
    const blogData = req.body; // Assuming the data matches the Blog schema
    console.log(blogData);
    const newBlog = new blogmodel(blogData);
    await newBlog.save();
    res.status(201).json({ msg: "blog created", newBlog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

blogRoute.get("/blogs", authentication, async (req, res) => {
  try {
    const blogs = await blogmodel.find().populate("username");
    console.log(blogs);
    res.status(201).json({ msg: "All blogs", blogs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

blogRoute.delete("/blogs/:id", authentication, async (req, res) => {
  try {
    let { id } = req.params;
    const blogs = await blogmodel.findById({ _id: id }).populate("username");
    console.log(blogs, req.body);
    if (req.email == blogs.username.email) {
      await blogmodel.findByIdAndDelete({ _id: id });
      res.status(201).json({ msg: "Deleted blog" });
    } else return res.json({ msg: "You cannot delete others blogs" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

blogRoute.patch("/blogs/:id", authentication, async (req, res) => {
  try {
    let { id } = req.params;
    let { content } = req.body;
    const blogs = await blogmodel.findById({ _id: id }).populate("username");
    console.log(blogs);
    if (req.email == blogs.username.email) {
      await blogmodel.findByIdAndUpdate({ _id: id }, { content });
      let updatedData = await blogmodel.findById({ _id: id });
      res.status(201).json({ msg: "updated blog", updatedData });
    } else return res.json({ msg: "You cannot update others blogs" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

blogRoute.patch("/blogs/:id/like", authentication, async (req, res) => {
  try {
    let { id } = req.params;
    await blogmodel.findByIdAndUpdate({ _id: id }, { $inc: { likes: 1 } });
    const updatedData = await blogmodel.findById({ _id: id });
    res.status(201).json({ msg: "updated blog", updatedData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

blogRoute.patch("/blogs/:id/comment", authentication, async (req, res) => {
  try {
    let { id } = req.params;
    const { username, content } = req.body; 
    const newComment = {
      username,
      content,
    };

   
    const updatedData = await blogmodel.findByIdAndUpdate(
      {_id:id},
      { $push: { comments: newComment } },
      { new: true }
    );

    res.status(201).json({ msg: "updated blog", updatedData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = { blogRoute };
