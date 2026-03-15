import express from "express"

import {
  addPrescription,
  getPatientPrescriptions,
  addPatientHistory,
  getPatientHistory
} from "../controllers/prescriptoController.js"

const router = express.Router()

router.post("/add",addPrescription)

router.get("/patient/:patientId",getPatientPrescriptions)

router.post("/history/add",addPatientHistory)

router.get("/history/:patientId",getPatientHistory)

export default router