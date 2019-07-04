const express = require("express");
const async = require("async");
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
//=======================get employee list with populate ==================================
router.get('/list', (req, res) => {
  const pageOptions = {
    page: parseInt(req.query.PageNum) || 0, //////////////////
    limit: parseInt(req.query.limit) || 5,////////////////////////
  }
  console.log('req',req.query);
  Node.find()
  .populate('parent')
  .sort({ date: -1 })
  .skip(pageOptions.page * pageOptions.limit)//////////////////////////
  .limit(pageOptions.limit)///////////////////////////////
  .then(nodes => res.status(200).json(nodes))
  .catch(err => res.status(404).json({ err: 'No employees found' , err}))
}) 
//=======================get Manager list loop detection=========================================
function getAllChildNodes(startNodeId, callback1) {
        var tree = [];//descandents
        var Nodes = [];

        Node.findOne({_id: startNodeId }, (err, curnode)=>{
          console.log('curnode-----', curnode.id)
          tree.push(curnode);

          Node.find({ parent: curnode.id}, (err, nodesToLoad)=>{
                Nodes = nodesToLoad
                console.log('new Nodes length: ', Nodes.length)
                let count = 0;
          
                async.whilst(
                    function test(cb) { cb(null, count < (Nodes.length)) },
                    function iter(callback) {
                        console.log('==========88888============')
                        var subnode = Nodes[count]
                        tree.push(subnode);
                        console.log('subnode id', subnode.name)
                        count += 1;
                        Node.find({ parent: subnode._id}).exec((err, children)=>{
                          if(children){
                              Nodes = Nodes.concat(children);
                              callback(null, count);
                          }
                          else{
                              console.log(err)
                              callback(null, err)/////??
                          }
                        }); 
                    },//iter
                    function (err, n) {
                      if(err)  
                        console.log(err)
                      else{
                        console.log('success', tree.length)
                        callback1(null,tree)
                        //return tree;
                      }
                    }
                  
                ); //async whilst
                console.log('out async whilst')
                //return tree;
          });//node.children;
      })//find curnode first
}

router.get('/manager/:user_id', (req, res) => {
  
    const node_id = req.params.user_id.slice(1)
    console.log('node_id------------', node_id)
    console.log('req',req.query);
    Node.find()
    .then(nodes => {
        console.log('nodes: length', nodes.length)
        var allchild = []
        var filterdNodes = []
        getAllChildNodes(node_id, (err, tree)=>{
          console.log('tree', tree.length)
          for(let i = 0; i < tree.length; i++){
            for(let j = 0; j < nodes.length; j++){
              if (JSON.stringify(nodes[j]._id) === JSON.stringify(tree[i]._id)){
                console.log('tree i id: ',tree[i]._id, nodes[j]._id);
                nodes.splice(j, 1)
              }
            }
          }
          nodes.map(node=> console.log(node._id))
          res.send(nodes)
        })
        //res.send(filterdNodes);
    })//then
    .catch(err => res.status(404).json({ err: 'No employees found' , err}));
    }
)
//==================delete an user and update parent DR and update children`s parent========================================================================
async function remove(curnodeid) {
  try {
    // return 
      const curNode = await Node.findOne({"_id": ObjectId(curnodeid)}) 
      const parentNode = await Node.findOne({"_id": ObjectId(curNode.parent)})     

      children = await Node.find({ parent: curnodeid })//.///////////////////
                            //exec(function (err, DRs) {
                             // if (err) return handleError(err);
                           /// console.log('The childrens are an array: ', DRs.length);}) )

      if (children.length > 0 && parentNode !== null){
        const res = await Node.updateMany({ parent: curnodeid }, {$set: { parent: parentNode._id }}).exec();
        //res.n; // Number of documents matched
        //res.nModified; // Number of documents modified
        await Node.updateOne({ _id: parentNode._id }, {$set: { DR: parentNode.DR + curNode.DR -1 }}).exec()
      }
      else if(parentNode !== null){
        await Node.updateOne({ _id: parentNode._id }, {$set: { DR: parentNode.DR -1 }}).exec()
      }               
      await Node.deleteOne({ _id: curnodeid })
      
  } catch(e) {
    // err handling
      console.log('err happend when delete node', e);
  }
}

router.delete('/users/:user_id', (req, res) => {
  console.log('delete userid received', req.params.user_id.slice(1));

  /*Node.findByIdAndRemove(req.params.user_id.slice(1), function(err) {
    if (err)
            res.send(err);
        res.json({ message: 'Successfully deleted' });
  });*/
  remove(req.params.user_id.slice(1));
  res.send('user deleted and updated parent DR and updated children parent');
})
//=========================================================================================
async function create(reqbody) {

  try {
    //const parentNode = await Node.findOne({"_id": ObjectId(PARENT_ID)})
    //console.log('parentNode', parentNode)
      //console.log('reqbody',reqbody)
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

      const parentNode = await Node.findOne({"_id": ObjectId(reqbody.parent)})

      await Node.updateOne({ _id: reqbody.parent }, {
        $set: { DR: parentNode.DR+1 }
      }).exec()
      
      return newNode;

  } catch (err) {
      console.log('err happend: ', err);
  }

}
router.post('/users', (req, res) => {//create Employee
    var PARENT_ID = req.body.parent;

    //console.log('parent_id',parent_id)
    var newnode = create(req.body);
    res.send('user created and updated DR');
});

//============================================================================================
router.post("/search", (req, res) => {
    const searchText = req.body.seachText;
    console.log("searchText:",searchText);
    Node.find((err, tmpusers) => {
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
//=======get detail and save update=================================================
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
async function editOne (req, res, id) {
  //let selectedUser = users.findIndex(user=>user.id === Number(id));
  try {
          var node = await Node.findById(req.body.params.user_id);
          console.log('found node', node);
          var oldparent = node.parent;
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
          node.parent=req.body.user.parent
          
          node.save();
          const parentNode = await Node.findOne({"_id": ObjectId(req.body.user.parent)})
          await Node.updateOne({ _id: req.body.user.parent }, {
            $set: { DR: parentNode.DR+1 }
          }).exec()
          
          if (oldparent){
            const oldparentNode = await Node.findOne({"_id": ObjectId(oldparent)})
            await Node.updateOne({ _id: oldparent }, {
              $set: { DR: oldparentNode.DR-1 }
            }).exec()
          }
          res.send('user updated and also the DR of its old parent and new parent');

  } catch (e) {
    // err handling
    console.log('err happend when update user detail',e);
  }

/*
  if (selectedUser >= 0) {
      users[selectedUser].name = req.body.name;
      res.status(200).json(`user with id ${id} is updated.`);
  }
  else {
      res.status(555).json(`user with id ${id} is not found!`);
  }*/
};

//=======get detail and save update=================================================

//==========================get DR list======================================
router.get('/users/DR/:user_id', (req, res) => {
  Node.
  find({ parent: req.params.user_id.slice(1) })
  .populate('parent')
  .exec(function (err, nodes) {
    if (err) return handleError(err);
    console.log('The stories are an array: ', nodes);
    res.json(nodes);
  });
});
