//import { objectOf } from "prop-types";

//import mongoose from 'mongoose'
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

const treeSchema = new Schema({
  name: String,
  parent: { type: Schema.Types.ObjectId, ref: 'Node'},
  //manager only one
    //type: Schema.Types.ObjectId,
    //ref: 'Node'
  title: { type: String,  },
  gender: { type: String},
  startdate: { type: String, default: null },///////////
  officephone: { type: String, },// required: true
  cellphone: { type: String,  default: null },
  sms: { type: String, default: null },
  email: { type: String, default: null },
  image: { type: String, default: null },
  DR:{ type: Number, default: 0}
});
treeSchema.plugin(mongoosePaginate);
/*let Employee = mongoose.model('Node', treeSchema)
module.exports = Employee;*/
let Node = mongoose.model('Node', treeSchema);
module.exports = Node;

