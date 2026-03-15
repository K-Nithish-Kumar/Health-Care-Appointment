import mongoose from "mongoose"

const tabletSchema = new mongoose.Schema({
    tabletName:{type:String,required:true},
    morning:{type:Boolean,default:false},
    afternoon:{type:Boolean,default:false},
    night:{type:Boolean,default:false},
    food:{type:String,enum:["Before Food","After Food"],default:"After Food"}
})

const prescriptionSchema = new mongoose.Schema({

    patientId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },

    doctorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"doctor",
        required:true
    },

    appointmentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"appointment"
    },

    date:{
        type:String,
        required:true
    },

    disease:{
        type:String,
        required:true
    },

    tablets:[tabletSchema],

},{timestamps:true})

const prescriptionModel =
mongoose.models.prescription || mongoose.model("prescription",prescriptionSchema)

export default prescriptionModel