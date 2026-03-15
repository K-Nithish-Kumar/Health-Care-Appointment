import prescriptionModel from "../models/prescriptionModel.js"


// ADD PRESCRIPTION
const addPrescription = async (req,res)=>{

try{

const {patientId,doctorId,appointmentId,date,disease,tablets} = req.body

const newPrescription = new prescriptionModel({
    patientId,
    doctorId,
    appointmentId,
    date,
    disease,
    tablets
})

await newPrescription.save()

res.json({
    success:true,
    message:"Prescription Saved Successfully"
})

}catch(error){

console.log(error)

res.json({
    success:false,
    message:"Error saving prescription"
})

}

}



// GET PATIENT HISTORY
const getPatientHistory = async (req,res)=>{

try{

const {patientId} = req.params

const history = await prescriptionModel
.find({patientId})
.sort({createdAt:-1})

res.json({
    success:true,
    history
})

}catch(error){

console.log(error)

res.json({
    success:false,
    message:"Error fetching history"
})

}

}



// GET APPOINTMENT PRESCRIPTION
const getAppointmentPrescription = async (req,res)=>{

try{

const {appointmentId} = req.params

const prescription = await prescriptionModel
.findOne({appointmentId})

res.json({
    success:true,
    prescription
})

}catch(error){

console.log(error)

res.json({
    success:false,
    message:"Error fetching prescription"
})

}

}


export {
addPrescription,
getPatientHistory,
getAppointmentPrescription
}