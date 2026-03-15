import mongoose from "mongoose"

const historySchema = new mongoose.Schema({

  patientId:{
    type:String,
    required:true
  },

  doctorName:String,

  disease:String,

  tablets:String,

  notes:String,

  date:{
    type:Date,
    default:Date.now
  }

})

const PatientHistory = mongoose.model("PatientHistory",historySchema)

export default PatientHistory