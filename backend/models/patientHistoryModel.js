import mongoose from "mongoose"

const patientHistorySchema = new mongoose.Schema({

patientId:{
type:mongoose.Schema.Types.ObjectId,
ref:"user",
required:true
},

doctorName:{
type:String,
required:true
},

disease:{
type:String,
required:true
},

tablets:{
type:String,
required:true
},

consultedDate:{
type:String
}

},{timestamps:true})

const patientHistoryModel =
mongoose.models.patientHistory ||
mongoose.model("patientHistory",patientHistorySchema)

export default patientHistoryModel