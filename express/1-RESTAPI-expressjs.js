'use strict';
const http = require('http');
const express    = require('express'); 
const router = express.Router();        
const bodyParser = require('body-parser');

const app        = express();                 

// base
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 8888;    

app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Resource-With, Content-Type, Accept");
    console.log("requst url = " + req.url);
	next();
})
app.use('/api', router);
app.get('/', (req, res) => {
    res.json({ message: 'hooray! welcome to our home!' });   
});

app.listen(port, () => {
    console.log('Magic happens on port ' + port)}
);

// routes
router.get('/', (req, res) => {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// create one
router.post('/users', (req, res) => {
    // retrieve new user info request body and save it
    createOne(req, res);
});

// get all
router.get('/users', (req, res) => {
    getAll(req, res);
});

// get one
router.get('/users/:user_id', (req, res) => {
    // return a single user with id = :id in response body
    getOne(req, res, req.params.user_id);
});

// update one
router.put('/users/:user_id', (req, res) => {
    // retrieve updated user info from request body and save it
    editOne(req, res, req.params.user_id);
});

// delete one
router.delete('/users/:user_id', (req, res) => {
    // delete existing user with id = :id
    deleteOne(req, res, req.params.user_id);
});

// data part
var User = function (user_name, user_sex, user_age=Math.floor((Math.random() * 10) + 1)) {
    this.id = Math.floor((Math.random() * 100) + 1);
	this.name = user_name,
	this.sex = user_sex,
	this.age = user_age
	};
	
var users =[];

users.push(new User('Mama', 'f', 40));
users.push(new User('Papa', 'm', 41));
users.push(new User('John', 'm', 11));
users.push(new User('Peter', 'm', 12));
users.push(new User('Mary', 'f', 13));

let getAll = (req, res) => {
    res.status(200);
    res.json(users);
};

let getOne = (req, res, id) => {
    let user = users.filter(user => user.id === Number(id));
	res.status(200).json(user[0]);
}

let createOne = (req, res) => {
    // turns out gett post data from basic nodejs is difficult so this is a fake one
    let newUser = new User();
    if (req.body.name) {
        newUser.name = req.body.name;
    }
    newUser.age = req.body.age;
    newUser.sex = req.body.sex;
    users.push(newUser); 
    res.status(200).json('a new user is added!');
};

let editOne = (req, res, id) => {
    let selectedUser = users.findIndex(user=>user.id === Number(id));
    if (selectedUser >= 0) {
        users[selectedUser].name = req.body.name;
        users[selectedUser].age = req.body.age;
        users[selectedUser].sex = req.body.sex;
        res.status(200).json(`user with id ${id} is updated.`);
    }
    else {
        res.status(555).json(`user with id ${id} is not found!`);
    }
};

let deleteOne = (req, res, id) => {
    let selectedUser = users.findIndex(user=>user.id === Number(id));
    if (selectedUser >= 0) {
        users.splice(selectedUser, 1);
        res.json(`user with id ${id} is deleted.`);
    }
    else {
        res.json(`user with id ${id} is not found!`);
    }
};
