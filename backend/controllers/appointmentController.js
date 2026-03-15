import appointmentModel from "../models/appointmentModel.js"
import patientHistoryModel from "../models/patientHistoryModel.js"


// SUBMIT PATIENT HISTORY

const submitHistory = async (req,res)=>{

try{

const {patientId,doctorName,disease,tablets,consultedDate} = req.body

const newHistory = new patientHistoryModel({
patientId,
doctorName,
disease,
tablets,
consultedDate
})

await newHistory.save()

res.json({
success:true,
message:"History saved successfully"
})

}catch(error){

console.log(error)

res.json({
success:false,
message:"Error saving history"
})

}

}



// BOOK APPOINTMENT

const bookAppointment = async (req,res)=>{

try{

const {
userId,
doctorId,
slotDate,
slotTime,
amount
} = req.body


// check if slot already booked

const existingAppointment =
await appointmentModel.findOne({
doctorId,
slotDate,
slotTime
})


if(existingAppointment){

return res.json({
success:false,
message:"Slot already booked"
})

}


// create appointment

const newAppointment = new appointmentModel({
userId,
doctorId,
slotDate,
slotTime,
amount
})

await newAppointment.save()


res.json({
success:true,
message:"Appointment booked successfully"
})

}catch(error){

console.log(error)

res.json({
success:false,
message:"Error booking appointment"
})

}

}



export {
submitHistory,
bookAppointment
}