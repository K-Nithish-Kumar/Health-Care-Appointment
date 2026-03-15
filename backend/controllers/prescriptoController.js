import Prescription from "../models/prescriptoModel.js"

const addPrescription = async (req,res)=>{

  try{

    const { patientId, doctorId, disease, tablets, notes } = req.body

    const prescription = new Prescription({
      patientId,
      doctorId,
      disease,
      tablets,
      notes
    })

    await prescription.save()

    res.json({
      success:true,
      message:"Prescription Added Successfully"
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


// GET PATIENT HISTORY

const getPatientPrescriptions = async (req,res)=>{

  try{

    const { patientId } = req.params

    const prescriptions = await Prescription.find({patientId})

    res.json({
      success:true,
      prescriptions
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




export { addPrescription, getPatientPrescriptions }