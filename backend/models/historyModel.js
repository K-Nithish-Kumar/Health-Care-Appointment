import mongoose from "mongoose";

const historySchema = new mongoose.Schema({

userId:{
type:String,
required:true
},

docId:{
type:String,
required:true
},

doctorName:{
type:String
},

disease:{
type:String
},

tablets:{
type:String
},

notes:{
type:String
},

date:{
type:Date,
default:Date.now
}

})

const historyModel = mongoose.models.history || mongoose.model("history",historySchema)

export default historyModel