const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Album = require("../models/album");
const Track = require("../models/track");
const Artist = require("../models/artist");

exports.tracks_get_all = (req, res, next) => {
  Track.find()
    .select("name album _id")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        tracks: docs.map(doc => {
          return {
            name: doc.name,
            album: doc.album,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/tracks/" + doc._id
            }
          };
        })
      };
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.tracks_get_track = (req, res, next) => {
  const id = req.params.trackId;
  Track.findById(id)
    .select("name _id album_id")
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          track: doc,
          request: {
            type: "GET",
            url: "http://localhost:3000/tracks"
          }
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.tracks_update_track = (req, res, next) => {
  const id = req.params.trackId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Track.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Track updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/tracks/" + id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.tracks_delete = (req, res, next) => {
  const id = req.params.trackId;
  Track.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Track deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/tracks",
          body: { name: "String", price: "Number" }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.albums_get_all = (req, res, next) => {
  Album.find()
    .select("name artist_id _id")
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        albums: docs.map(doc => {
          return {
            _id: doc._id,
            name: doc.name,
            artist_id: doc.artist_id,
            request: {
              type: "GET",
              url: "http://localhost:3000/albums/" + doc._id
            }
          };
        })
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.albums_get_album = (req, res, next) => {
  Album.findById(req.params.albumId)
    .populate("track")
    .exec()
    .then(album => {
      if (!album) {
        return res.status(404).json({
          message: "Album not found"
        });
      }
      res.status(200).json({
        album: album,
        request: {
          type: "GET",
          url: "http://localhost:3000/albums"
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.albums_update_album = (req, res, next) => {
  const id = req.params.albumId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Album.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Album updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/albums/" + id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.albums_delete_album = (req, res, next) => {
  Album.remove({ _id: req.params.albumId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Album deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/albums",
          body: { trackId: "ID", artist: "Number" }
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.artists_get_all = (req, res, next) => {
  Artist.find()
    .select("name _id")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        artists: docs.map(doc => {
          return {
            name: doc.name,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/artists/" + doc._id
            }
          };
        })
      };
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.artists_get_artist = (req, res, next) => {
  const id = req.params.artistId;
  Artist.findById(id)
    .select("name _id")
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          artist: doc,
          request: {
            type: "GET",
            url: "http://localhost:3000/artists"
          }
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.user_signup = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail exists"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            });
            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: "User created"
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    });
};

exports.user_login = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h"
            }
          );
          return res.status(200).json({
            message: "Auth successful",
            token: token
          });
        }
        res.status(401).json({
          message: "Auth failed"
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};
