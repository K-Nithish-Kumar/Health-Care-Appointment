import express from "express"

import {
addPrescription,
getPatientHistory,
getAppointmentPrescription
} from "../controllers/doctorController.js"


const prescriptionRouter = express.Router()


// SAVE PRESCRIPTION
prescriptionRouter.post("/add",addPrescription)


// GET PATIENT HISTORY
prescriptionRouter.get("/patient-history/:patientId",getPatientHistory)


// GET APPOINTMENT PRESCRIPTION
prescriptionRouter.get("/appointment-prescription/:appointmentId",getAppointmentPrescription)


export default prescriptionRouter