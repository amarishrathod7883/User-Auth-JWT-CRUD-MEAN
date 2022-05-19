const express = require('express');
const router = express.Router();

const User = require('../models/user.model');
const UserRole = require('../models/role.model');
var fileUpload = require('../middlewares/fileUpload');

const verifyToken = require('../middlewares/authJwt');

router.post('/getAllUsers', [verifyToken], function (req, res) 
{
  console.log('req.body', req.body);
  var searchCondition = {};
  const resultsPerPage = parseInt(req.body.pageSize);
  const pageNumber = (req.body.pages) > 0 ? (((req.body.pages) - 1) * resultsPerPage) : 0
  
  if(req.body._id != undefined)
  {
    searchCondition._id = req.body._id;
  }

  if(!!req.body.username)
  {
    var regexUsername = new RegExp(req.body.username, "i");
    searchCondition.username = regexUsername;
  }

  User
  .countDocuments(searchCondition)
  .then(fetchedUserCount => 
  {
    User
    .find(searchCondition)
    .skip(pageNumber)
    .limit(resultsPerPage)
    .populate({
        path: 'user_role_id '
    })
    .sort({_id: 1})
    .lean()
    .then(fetchedUser => 
    {
      res.status(200).send({ data: fetchedUser, fetchedUserCount: fetchedUserCount, message: "User fetched successfully!" });
    })
    .catch(error => {
      res.status(500).send({ message: error });
      return;
    });
  })
  .catch(error => {
    res.status(500).send({ message: error });
    return;
  });
});

router.get('/getSingleUser/:id', [verifyToken], function (req, res) 
{
  User
  .findById(req.params.id)
  .populate('user_role_id')
  .then(fetchedUser => {
    res.status(200).send({ data: fetchedUser, message: "User fetched successfully!" });
  })
  .catch(error => {
    res.status(500).send({ message: error });
    return;
  });
});

router.put('/updateUser/:id', fileUpload.single('profileimage'), [verifyToken], function (req, res) 
{
  console.log("req.file", req.file);
  console.log("req.body", req.body);

  User
  .findOne({
      _id: { 
        $ne: req.params.id 
      },
      $or: [
        { username: req.body.username },
        { email: req.body.email }
      ],
      
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
          var userDataObj = {
            firstname: (!!req.body.firstname && req.body.firstname != null) ? req.body.firstname : '',
            lastname: (!!req.body.lastname && req.body.lastname != null) ? req.body.lastname : '',
            username: req.body.username,
            email: req.body.email,
            profileimage: (!!req.file || req.file != undefined) ? req.file.filename : '',
            user_role_id: fetchedUserRole._id
          };

          User
          .findOneAndUpdate(req.params.id, userDataObj)
          .then(savedUser => 
          {
            res.send({ data: savedUser, message: "User was updated successfully!" });
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

router.get('/removeUser/:id', [verifyToken], function (req, res) 
{
  console.log("req.params.id", req.params.id);
  User
  .findOneAndRemove({'_id': req.params.id})
  .then(fetchedUser => {
    res.status(200).send({ data: fetchedUser, message: "User deleted successfully!" });
  })
  .catch(error => {
    res.status(500).send({ message: error });
    return;
  });
});

router.get('/removeAllUser', [verifyToken], function (req, res) 
{
  UserRole
  .findOne({
    role_name: 'admin'
  })
  .then(fetchedUserRole => 
  {
    User
    .find({
      user_role_id: {
        $ne: fetchedUserRole._id
      }
    })
    .then(fetchedUser => {
      res.status(200).send({ data: fetchedUser, message: "User deleted successfully!" });
    })
    .catch(error => 
    {
      res.status(500).send({ message: error });
      return;
    });
  })
  .catch(error => 
  {
    res.status(500).send({ message: error });
    return;
  });
});



module.exports = router;