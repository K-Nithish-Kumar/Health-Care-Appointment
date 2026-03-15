import Prescription from "../models/prescriptoModel.js"
import PatientHistory from "../models/patientHistoryModel.js"


// ADD PRESCRIPTION

const addPrescription = async (req,res)=>{

  try{

    const {patientId,doctorId,doctorName,disease,tablets,notes} = req.body

    const newPrescription = new Prescription({
      patientId,
      doctorId,
      doctorName,
      disease,
      tablets,
      notes
    })

    await newPrescription.save()

    res.json({
      success:true,
      message:"Prescription Added"
    })

  }
  catch(error){

    console.log(error)

    res.json({
      success:false,
      message:error.message
    })

  }

}


// GET PRESCRIPTION HISTORY

const getPatientPrescriptions = async (req,res)=>{

  try{

    const {patientId} = req.params

    const prescriptions = await Prescription
      .find({patientId})
      .sort({createdAt:-1})   // newest first

    res.json({
      success:true,
      prescriptions
    })

  }
  catch(error){

    res.json({
      success:false,
      message:error.message
    })

  }

}


// ADD EXTERNAL HISTORY

const addPatientHistory = async (req,res)=>{

  try{

    const history = new PatientHistory(req.body)

    await history.save()

    res.json({
      success:true,
      message:"History Added"
    })

  }
  catch(error){

    res.json({
      success:false,
      message:error.message
    })

  }

}


// GET HISTORY

const getPatientHistory = async (req,res)=>{

  try{

    const {patientId} = req.params

    const history = await PatientHistory
      .find({patientId})
      .sort({date:-1})

    res.json({
      success:true,
      history
    })

  }
  catch(error){

    res.json({
      success:false,
      message:error.message
    })

  }

}


export {
  addPrescription,
  getPatientPrescriptions,
  addPatientHistory,
  getPatientHistory
}