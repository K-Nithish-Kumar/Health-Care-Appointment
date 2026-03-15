import express from "express"

import {
submitHistory,
bookAppointment
} from "../controllers/appointmentController.js"

const appointmentRouter = express.Router()


// submit patient history

appointmentRouter.post("/submit-history",submitHistory)


// book appointment

appointmentRouter.post("/book-appointment",bookAppointment)


export default appointmentRouter