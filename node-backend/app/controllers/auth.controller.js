const express = require('express');
const router = express.Router();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

const User = require('../models/user.model');
const UserRole = require('../models/role.model');

router.post('/signup', function (req, res) 
{
  
  User.findOne({
    $or: [
      { username: req.body.username },
      { email: req.body.email }
    ]
  })
  .then(fetchedUser => {
    if(fetchedUser)
    {
      if(fetchedUser['username'] == req.body.username && fetchedUser['email'] == req.body.email)
      {
        res.status(400).send({ message: "Failed! Username & Email is already in use!" });
      }
      else
      {
        if(fetchedUser['username'] == req.body.username)
        {
          res.status(400).send({ message: "Failed! Username is already in use!" });
        }
        else
        {
          res.status(400).send({ message: "Failed! Email is already in use!" });
        }
      }
    }
    else
    {
      UserRole
      .findOne({ role_name: req.body.role_name })
      .then(fetchedUserRole => {
        if(fetchedUserRole)
        {
          new User({
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
            user_role_id: fetchedUserRole._id
          })
          .save()
          .then(savedUser => 
          {
            res.send({ message: "User was registered successfully!" });
          })
          .catch(error => {
            res.status(500).send({ message: error });
            return;
          });
        }
      })
      .catch(error => {
        res.status(500).send({ message: error });
        return;
      });
    }
  })
  .catch(error => {
    res.status(500).send({ message: error });
    return;
  });
});

router.post('/signin', function (req, res) 
{
  User.findOne({
    username: req.body.username
  })
  .populate({
      path: 'user_role_id '
  })
  .then(fetchedUser => {
    if(!fetchedUser)
    {
      return res.status(404).send({ message: "User Not found." });
    }
    else
    {
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        fetchedUser.password
      );

      if (!passwordIsValid) 
      {
        return res.status(401).send({ accessToken: null, message: "Invalid Password!" });
      }
      else
      {
        var token = jwt.sign({ id: fetchedUser.id }, "SecretB2B", {
          expiresIn: 86400 // 24 hours
        });

        console.log("fetchedUser", fetchedUser);

        res.status(200).send({
          id: fetchedUser._id,
          username: fetchedUser.username,
          email: fetchedUser.email,
          role_name: (fetchedUser.user_role_id.role_name).toUpperCase(),
          accessToken: token
        });
      } 
    }
  });
});

module.exports = router;

