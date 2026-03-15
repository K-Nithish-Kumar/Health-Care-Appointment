import prescriptionModel from "../models/prescriptoModel.js"


// ADD PRESCRIPTION

const addPrescription = async (req,res)=>{

try{

const {appointmentId,userId,date,disease,tablets} = req.body

const newPrescription = new prescriptionModel({
appointmentId,
userId,
date,
disease,
tablets
})

await newPrescription.save()

res.json({
success:true,
message:"Prescription added successfully"
})

}catch(error){

console.log(error)

res.json({
success:false,
message:"Error adding prescription"
})

}

}



// GET PATIENT HISTORY

const getPatientHistory = async (req,res)=>{

try{

const {patientId} = req.params

const prescriptions =
await prescriptionModel
.find({userId:patientId})
.sort({createdAt:-1})


res.json({
success:true,
prescriptions
})

}catch(error){

console.log(error)

res.json({
success:false,
message:"Error fetching history"
})

}

}


export { addPrescription, getPatientHistory }