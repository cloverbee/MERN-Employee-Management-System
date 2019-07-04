const express = require("express");
var bodyParser = require("body-parser");

const path = require("path");
const mongoose = require("mongoose");
const mongodbConnect = require("./config/database");

const db = mongoose.connection;
const app = new express();
const Node = require('./models/Tree');///////////////
const router = express.Router(); 
var ObjectId = require('mongodb').ObjectId


mongodbConnect();

// Server Middleware
app.use(bodyParser.json());
app.use((req, res, next) => {
  console.log("A " + req.method + " request received at " + new Date());
  next();
});
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});
app.listen(8080, () => {
  console.log("Listening to port 8080.");
});

app.use('/api', router);
//=========================================================
//app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.json({ message: 'hooray! welcome to our home!' });   
});
//=========================================================
router.get('/', (req, res) => {
  res.json({ message: 'hooray! welcome to our api!' });   
});
//=========================================================
router.get("/list", (req, res) => {
  Node.find().
  populate('parent').
  exec(function (err, Nodes) {
    if (err)
      console.log(err) 
    var newNodes = Nodes.slice();
    for(var index in newNodes)
    {
        Node.find({ parent: Nodes[index].id }).///////////////////
                    exec(function (err, DRs) {
                        if (err) return handleError(err);
                        console.log('The stories are an array: ', DRs.length);
                        newNodes[index].DR = DRs.length;
                        console.log('newNodes[index].DR', newNodes[index].DR);
                    })//exec
    }
      
      
      let p = new Promise( function(){
        for(var index in Nodes)
        {
            var curnode = Nodes[index]
            Node.find({ parent: curnode.id }).///////////////////
                    exec(function (err, DRs) {
                        if (err) return handleError(err);
                        console.log('The stories are an array: ', DRs.length);
                        //tmparr = DRs;
                        //nodes[index].update({DR: DRs.length}) //= DRs.length;
                        curnode.DR = DRs.length;
                        curnode.save(function(err) {
                          if (err) // do something
                            console.log('err',err);
                        });
                        //console.log('SEC DR', curnode.DR, DRs.length)//tmparr.length;
                    })//exec
            
        }//for loop
        
        });//p
        p.then(res.send(Nodes))
  });
})
//========================================================
router.get("/DRlist", (req, res) => {
  Node.
    find({ parent: req.parent_id }).///////////////////
    exec(function (err, nodes) {
      if (err) return handleError(err);
      console.log('The stories are an array: ', nodes);
      res.send(nodes);
    });
})
//========================================================   
    /*(err, nodes) => {
    if (err) {
        res.status(500).send(err);
    }
    res.json(nodes);//status(200).json(users);
    console.log('users sent already!');
  }).then((nodes) => {//
    //console.log('then users',users)
  }).catch((err) => {
    
  });
  
});*/
//============================================================
router.delete('/users/:user_id', (req, res) => {
  console.log('delete userid received', req.params.user_id.slice(1));  
  User.findByIdAndRemove(req.params.user_id.slice(1), function(err) {
    if (err)
            res.send(err);

        res.json({ message: 'Successfully deleted' });
    });
})
//=========================================================================================
async function create(reqbody) {

  try {
    //const parentNode = await Node.findOne({"_id": ObjectId(PARENT_ID)})
    //console.log('parentNode', parentNode)
      console.log('reqbody',reqbody)
      const node = new Node({
        image: reqbody.image,
        name: reqbody.name,
        title: reqbody.title,
        gender: reqbody.gender,
        startdate: reqbody.startdate,
        officephone: reqbody.officephone,
        cellphone: reqbody.cellphone,
        sms: reqbody.sms,
        email: reqbody.email,
        parent: reqbody.parent,///////////////////////////////
      })
      
      const newNode = await node.save()

      //await Node.update({ _id: parentNode._id }, {
      //  $push: { children: newNode._id }
      //}).exec()
      
      return newNode;
  } catch (err) {
      console.log('err happend: ', err);
  }

}

//==========================================================================================
router.post('/users', (req, res) => {//create Employee
    var parent_id = req.body.pid;

    //console.log('parent_id',parent_id)
    var newnode = create(req.body);
    console.log('newnode', newnode);

});

//============================================================================================
router.post("/search", (req, res) => {
    const searchText = req.body.seachText;
    console.log("searchText:",searchText);
    User.find((err, tmpusers) => {
                if (err) {
                    res.status(500).send(err);
                }
                console.log('Got tmpusers already!');
              })
              .then((tmpusers) => {//
              //==========================================
                if (!searchText) {
                  console.log('null searchText'+ new Date());
                  res.json({matchedText: []});
                }
                ///////////////////////////////console.log('tmpusers data:', tmpusers);
                let matchedResult1 = tmpusers.filter((ele) => ele.firstName.toUpperCase().indexOf(searchText.toUpperCase()) > -1);
                let filtedPart1 = tmpusers.filter((ele) => ele.firstName.toUpperCase().indexOf(searchText.toUpperCase()) == -1);
                let matchedResult2 = filtedPart1.filter((ele)=> ele.lastName.toUpperCase().indexOf(searchText.toUpperCase()) > -1);
                let filtedPart2 = filtedPart1.filter((ele)=> ele.lastName.toUpperCase().indexOf(searchText.toUpperCase()) == -1);
                let matchedResult3 = filtedPart2.filter((ele)=> ele.sex.toUpperCase().indexOf(searchText.toUpperCase()) > -1);
                var ele;
                //console.log('matchedResult2', matchedResult2)
                for(ele in matchedResult2)
                {
                  //console.log('ele', ele)
                  matchedResult1.push(matchedResult2[ele]);
                }
                for(ele in matchedResult3)
                {
                  matchedResult1.push(matchedResult3[ele]);
                }
                
                res.json({matchedText: matchedResult1});
                
                //////////////////////////////console.log('Matched users',matchedResult);
              })
              .catch((err) => {
                console.log(' Catch err got users when searching',err)
              });

    //console.log('result users',matchedResult);
});

router.get('/users/:user_id', (req, res) => {
  Node.findById(req.params.user_id.slice(1), function(err, user) {
    if (err)
            res.send(err);

    res.json(user);
    console.log('Node sent already!');
  }).then((users) => {//
    //console.log('then users',users)
  }).catch((err) => {
  });
});

router.put('/users/:user_id', (req, res) => {
  // retrieve updated user info from request body and save it
  editOne(req, res, req.params.user_id);
});
let editOne = (req, res, id) => {
  //let selectedUser = users.findIndex(user=>user.id === Number(id));
  
  Node.findById(req.body.params.user_id, function(err, node) {
    //console.log('req', req);
      if (err)
              res.send(err);

      //res.json(node);
      console.log('214 node', node)
      node.image= req.body.user.image,
      // update the user info
      node.name= req.body.user.name,
      node.title= req.body.user.title,
      node.gender= req.body.user.gender,
      node.startdate= req.body.user.startdate,
      node.officephone= req.body.user.officephone,
      node.cellphone= req.body.user.cellphone,
      node.sms=req.body.user.sms,
      node.email=req.body.user.email,
      node.parent=req.body.user.parent,
      node.children=req.body.user.children,
      
      // save the user
      node.save(function(err) {
          if (err){
              res.send(err);
              console.log('err:', err);
          }
          else{
              res.json({ message: 'node updated!' });
          }
      });
    });

/*
  if (selectedUser >= 0) {
      users[selectedUser].name = req.body.name;
      res.status(200).json(`user with id ${id} is updated.`);
  }
  else {
      res.status(555).json(`user with id ${id} is not found!`);
  }*/
};

