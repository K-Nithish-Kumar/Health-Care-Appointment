import mongoose from "mongoose"

const tabletSchema = new mongoose.Schema({

  tabletName:String,
  morning:Boolean,
  afternoon:Boolean,
  night:Boolean,
  food:String,
  days:Number

})

const prescriptionSchema = new mongoose.Schema({

  patientId:{
    type:String,
    required:true
  },

  doctorId:{
    type:String,
    required:true
  },

  doctorName:String,

  disease:{
    type:String,
    required:true
  },

  tablets:[tabletSchema],

  notes:String,

  createdAt:{
    type:Date,
    default:Date.now
  }

})

const Prescription = mongoose.model("Prescription",prescriptionSchema)

export default Prescription