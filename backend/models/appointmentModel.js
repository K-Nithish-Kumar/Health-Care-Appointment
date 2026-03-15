import mongoose from "mongoose"

const appointmentSchema = new mongoose.Schema({

userId:{
type:mongoose.Schema.Types.ObjectId,
ref:"user",
required:true
},

doctorId:{
type:mongoose.Schema.Types.ObjectId,
ref:"doctor",
required:true
},

slotDate:{
type:String,
required:true
},

slotTime:{
type:String,
required:true
},

amount:{
type:Number,
required:true
},

payment:{
type:Boolean,
default:false
},

cancelled:{
type:Boolean,
default:false
},

isCompleted:{
type:Boolean,
default:false
}

},{timestamps:true})

const appointmentModel =
mongoose.models.appointment ||
mongoose.model("appointment",appointmentSchema)

export default appointmentModel