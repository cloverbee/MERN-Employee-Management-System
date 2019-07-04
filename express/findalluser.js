const Mongoose   = require('mongoose');

// connect
let p = Mongoose.connect('mongodb://Elaine:039982@cluster0-shard-00-00-qm0uv.gcp.mongodb.net:27017,cluster0-shard-00-01-qm0uv.gcp.mongodb.net:27017,cluster0-shard-00-02-qm0uv.gcp.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true');
p.catch(err => console.log('in error callback', err));
p.then(console.log('db connected'));

// get persistent class
const User     = require('./user');

// get all instances in a collection: Bear
User.find((err, users) => {
	if (err) {
		console.log(err);
	}
	else {
		console.log(users);
	}
});