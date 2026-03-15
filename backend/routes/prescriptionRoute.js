import express from "express"
import { addPrescription, getPatientPrescriptions } from "../controllers/prescriptoController.js"

const prescriptionRouter = express.Router()

prescriptionRouter.post("/add",addPrescription)

prescriptionRouter.get("/patient/:patientId",getPatientPrescriptions)

export default prescriptionRouter