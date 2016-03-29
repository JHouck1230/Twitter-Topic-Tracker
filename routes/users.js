'use strict';

var express = require('express');
var router = express.Router();
var Twitter = require('twitter');

var client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

var User = require('../models/user');

router.get('/', function(req, res) {
  User.find({}, function(err, users) {
    res.status(err ? 400 : 200).send(err || users);
  });
});

router.get('/interests', User.authMiddleware, function(req, res) {
  res.send(req.user);
});

router.put('/viewTweets', User.authMiddleware, function(req, res) {
  var interests = req.body.interests;
  if(Array.isArray(req.body.interests)) interests = req.body.interests.join();
  client.stream('statuses/filter', {track: interests},  function(stream){
  stream.on('data', function(tweet) {
    console.log(tweet.user.screen_name, ': ', tweet.text);
  });

  stream.on('error', function(error) {
    console.log(error);
  });
});
});

router.post('/authenticate', function(req, res) {
  User.authenticate(req.body, function(err, user) {
    if(err) {
      res.status(400).send(err);
    } else {
      var token = user.generateToken();
      res.cookie('appCookie', token).send(user);
    }
  });
});

router.post('/register', function(req, res) {
  User.register(req.body, function(err, user) {
    var token = user.generateToken();
     if(err) {
      res.status(400).send(err);
    } else {
      var token = user.generateToken();
      res.cookie('appCookie', token).send(user);
    }
  });
});

router.post('/addInterest', User.authMiddleware, function(req, res) {
  User.findById(req.user._id, function(err, user) {
    user.interests.push(req.body.interests);
    user.save(function(err, user) {
      res.status(err ? 400 : 200).send(err || user);
    });
  });
});

router.delete('/removeInterest', User.authMiddleware, function(req, res) {
  User.findById(req.user._id, function(err, user) {
    user.interests.splice(user.interests.indexOf(req.body.interests), 1);
    user.save(function(err, user) {
      res.status(err ? 400 : 200).send(err || user);
    });
  });
});

router.delete('/logout', function(req, res) {
  res.clearCookie('appCookie').send();
});

router.delete('/deleteAccount', User.authMiddleware,function(req, res) {
  User.findByIdAndRemove(req.user._id, function(err) {
    res.status(err ? 400 : 200).send(err);
  });
});

module.exports = router;
