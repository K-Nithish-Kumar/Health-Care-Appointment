import express from "express"
import { addPrescription, getPatientHistory } from "../controllers/prescriptoController.js"

const prescriptionRouter = express.Router()


// ADD PRESCRIPTION
prescriptionRouter.post("/add", addPrescription)


// PATIENT HISTORY
prescriptionRouter.get("/patient-history/:patientId", getPatientHistory)


export default prescriptionRouter