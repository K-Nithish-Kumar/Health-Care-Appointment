import mongoose from "mongoose"

const tabletSchema = new mongoose.Schema({
name:String,
morning:String,
afternoon:String,
night:String,
food:String
})

const prescriptionSchema = new mongoose.Schema({

appointmentId:{
type:mongoose.Schema.Types.ObjectId,
required:true
},

userId:{
type:mongoose.Schema.Types.ObjectId,
ref:"user",
required:true
},

date:{
type:String,
required:true
},

disease:{
type:String,
required:true
},

tablets:[tabletSchema]

},{timestamps:true})

const prescriptionModel =
mongoose.models.prescription ||
mongoose.model("prescription",prescriptionSchema)

export default prescriptionModel