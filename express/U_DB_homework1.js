const Mongoose = require('mongoose');
const express = require('express');
var bodyParser = require('body-parser');

const app = express();

var User = require('./user'); 

let p = Mongoose.connect('mongodb://Elaine:039982@cluster0-shard-00-00-qm0uv.gcp.mongodb.net:27017,cluster0-shard-00-01-qm0uv.gcp.mongodb.net:27017,cluster0-shard-00-02-qm0uv.gcp.mongodb.net:27017/1stprojectbackup?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true');
p.catch(err => console.log('in error callback', err));
p.then(console.log('db connected'));
//=============================================================================
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// 2nd part -- add actual routing
// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// more routes for our API will happen here

// 3rd part - insert a user POST
// on routes that end in /users
// ----------------------------------------------------
router.route('/users/insertone')/////////////////////////////////////////right

    // create a user (accessed at POST http://localhost:8080/api/users/insertone)
    .post(function(req, res) {
        
        var user = new User();      // create a new instance of the User model
        user.firstname = req.body.firstname;  // set the User name (comes from the request)
        user.lastname = req.body.lastname;
        user.age = req.body.age;
        user.sex = req.body.sex;
        user.password = req.body.password;
        user.save(function(err) {
            if (err)
                res.send(err);
            else{////////////////////////////////////////////////////////?
                res.json({ message: 'User created!' });
            }
        });    
    })
// 4th part -- get the user list
// get all the users (accessed at GET http://localhost:8080/api/users/getall)
router.route('/users/getall')//////////////////////////////////////right
    .get(function(req, res) {
        User.find(function(err, users) {
            if (err)
                res.send(err);

            res.json(users);
        });
    });
// 4th part

// 5th part - access an individual 
// on routes that end in /bears/:bear_id
// ----------------------------------------------------
router.route('/users/getone/:user_id')////////////////////////////////right
    //accessed at GET http://localhost:8080/api/users/getone/:user_id)
    .get(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err)
                res.send(err);
            res.json(user);
        });
    })
	//;
// 5th part

// 6th part -- update
// update the bear with this id (accessed at PUT http://localhost:8080/api/users/:user_id)
    .put(function(req, res) {

        // use our bear model to find the bear we want
        User.findById(req.params.user_id, function(err, user) {

            if (err)
                res.send(err);

            user.name = req.body.name;  // update the user info
            /*
            user.firstname = req.body.firstname;  // set the User name (comes from the request)
            user.lastname = req.body.lastname;
            user.age = req.body.age;
            user.sex = req.body.sex;
            user.password = req.body.password;*/

            // save the user
            user.save(function(err) {
                if (err){
                    res.send(err);
                    console.log('err:', err);
                }
                else{
                    res.json({ message: 'User updated!' });
                }
            });

        });
    })
    //;
// 6th part

// 7th part - delete
// delete the bear with this id (accessed at DELETE http://localhost:8080/api/users/deleteone/:user_id)
router.route('/users/deleteone/:user_id')////////////////////////////////////right
    .delete(function(req, res) {
        User.remove({
            _id: req.params.user_id
        }, function(err, user) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });
// 7th part 

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/app', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);