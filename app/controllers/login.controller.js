const memberModel = require('../models/member.model.js');
var jwt = require('jsonwebtoken');
var config = require('../../config/config.js');

// Find a single member with a memberID
exports.verifyUser = (req, res) => {
    // fetch user and test password verification
    memberModel.findOne({ username: req.body.username }, function(err, member) {
     if (err) throw err;
 
     // test a matching password
     member.comparePassword(req.body.password, function(err, isMatch) {
         if (err) throw err;
         console.log(req.body.password, isMatch); // -> Password123: true
        // return  res.send(isMatch);

        // Add token to login api
        if (!isMatch) return res.status(401).send({ auth: false, token: null });

        var token = jwt.sign({ id: member._id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
          });
          res.status(200).send({ auth: true, token: token });


        //res.send(isMatch);
         
     });
 
 });
 };
 

 exports.verifyTokenTest = (req, res) => {
    // fetch user and test password verification
    memberModel.findOne({ username: req.body.username }, function(err, member) {
     if (err) throw err;
 
     // test a matching password
     member.comparePassword(req.body.password, function(err, isMatch) {
         if (err) throw err;
         console.log(req.body.password, isMatch); // -> Password123: true
        // return  res.send(isMatch);

        // Add token to login api
       


        res.send(isMatch);
         
     });
 });
 };
