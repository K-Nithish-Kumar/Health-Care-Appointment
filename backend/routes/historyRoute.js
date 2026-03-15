import express from "express"
import { submitHistory } from "../controllers/historyController.js"
import authUser from "../middlewares/authUser.js"

const historyRouter = express.Router()

historyRouter.post("/submit-history",authUser,submitHistory)

export default historyRouter