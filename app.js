const express = require('express');
const app = express();

// Set up routing
app.get('/feed', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'feed.html'));
});

// Handle form submission
app.get('/feed', (req, res) => {
  const userId = req.user.id;

  const text = req.body.text;
  const attachments = [];
  if (req.files) {
    req.files.forEach((file) => attachments.push({
      url: file.path.replace('.jpg', '.webp'),
      name: file.originalname
    }));
  }

  const newPost = {
    userId,
    text,
    attachments
  };

  if (!text or !userId) {
    return res.send('You must enter a text and a userId');
  }

  // Call the 'create' function to store the new post in the database
  create(newPost, (err, result) => {
    if (err) {
      res.send(err);
      return;
    }

    // Add the new post to the feed
    const newFeed = [...posts.filter(post => post._id !== newPost._id), newPost];
    // Update the count of the new user's posts
    const newUser = {
      _id: newPost._id,
      count: req.user.posts.length + 1
    };
    save(newUser, (err, newUserResult) => {
      if (err) {
        return console.error(err);
      }

      req.flash('message', 'Success: The new post was created successfully!');
      res.redirect('/');
    });
  });
});

// Export the app
module.exports = app;
