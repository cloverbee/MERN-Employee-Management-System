const Node = require( './Tree')
//import { normalize, Schema, arrayOf } from 'normalizr'

// create
async function create(PARENT_ID) {

  try {
    var lPARENT_ID = PARENT_ID;
    const parentNode = await Node.findOne({"_id": ObjectId(PARENT_ID)})//({ _id: lPARENT_ID })

    const node = new Node({
      parent: parentNode._id,
      ancestors: parentNode.parent.concat(parentNode._id)///////////？？ancestors
    })
    
    const newNode = await node.save()

    await Node.update({ _id: parentNode._id }, {
      $push: { children: newNode._id }
    }).exec()

    return newNode

  } catch (e) {
    console.log('err happend: ', err);
  }

}

// retrieve
async function getTree() {

  try {

    let nodes = await Node.find()
    console.log('nodes type', typeof(nodes));
    const nodeSchema = new Schema('nodes', { idAttribute: '_id' })
    const normalized = normalize(nodes, arrayOf(nodeSchema))
    console.log('normalized type', typeof(normalized));
    nodes = normalized.entities.nodes
    console.log('normalized.entities.nodes type', typeof(normalized.entities.nodes));
    const ids = normalized.result
    console.log('normalized.result type', typeof(ids));
    /*
    const makeTree = id => {
      return Object.assign({}, nodes[id], {
        children: nodes[id].children.map(makeTree)
      })
    }
    return makeTree('NODE_ID') */

    
  } catch (e) {
    // err handling
  }

}

// update
async function update() {//Moving a tree

  try {

    const node = await Node.findOne({ _id: 'NODE_ID' })

    Node.update({ _id: node.parent }, {
      $pull: { children: node._id }
    }).exec()

    Node.update({ _id: 'NEW_PARENT_NODE_ID' }, {
      $push: { children: node._id }
    }).exec()

    Node.update({ _id: node._id }, {
      parent: 'NEW_PARENT_NODE_ID'
    }).exec()

  } catch (e) {
    // err handling
  }
  
}

// delete
async function remove() { //Removing a tree
  
  try {

    const node = await Node.find({ _id: 'NODE_ID' })

    Node.update({ _id: node.parent }, {
      $pull: { children: node._id }
    }).exec()

    Node.remove({
      ancestors: node._id
    }).exec()

    Node.remove({
      _id: node._id
    })

    // return 

  } catch(e) {
    // err handling
  }

}