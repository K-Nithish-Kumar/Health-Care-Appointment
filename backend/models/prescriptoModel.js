import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({

  patientId:{
    type:String,
    required:true
  },

  doctorId:{
    type:String,
    required:true
  },

  disease:{
    type:String,
    required:true
  },

  tablets:[
    {
      tabletName:{
        type:String,
        required:true
      },

      morning:{
        type:Boolean,
        default:false
      },

      afternoon:{
        type:Boolean,
        default:false
      },

      night:{
        type:Boolean,
        default:false
      },

      food:{
        type:String,
        enum:["Before Food","After Food"]
      },

      days:{
        type:Number
      }
    }
  ],

  notes:{
    type:String
  },

  date:{
    type:Date,
    default:Date.now
  }

})

const Prescription = mongoose.model("Prescription",prescriptionSchema)

export default Prescription