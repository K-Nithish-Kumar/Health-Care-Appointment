import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import { toast } from 'react-toastify'
import axios from 'axios'

const Appointment = () => {

const { docId } = useParams()

const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext)

const navigate = useNavigate()

const daysOfWeek = ['SUN','MON','TUE','WED','THU','FRI','SAT']

const [docInfo,setDocInfo] = useState(null)
const [docSlots,setDocSlots] = useState([])
const [slotIndex,setSlotIndex] = useState(0)
const [slotTime,setSlotTime] = useState("")

const [showHistoryPopup,setShowHistoryPopup] = useState(false)
const [showHistoryForm,setShowHistoryForm] = useState(false)

const [historyData,setHistoryData] = useState({
doctorName:'',
disease:'',
tablets:'',
notes:''
})

/* ---------------- FETCH DOCTOR ---------------- */

const fetchDocInfo = () => {

const doctor = doctors.find(doc => doc._id === docId)

if(!doctor){
toast.error("Doctor not found")
return
}

setDocInfo(doctor)

}

/* ---------------- SLOTS ---------------- */

const getAvailableSlots = () => {

setDocSlots([])

let today = new Date()

for(let i=0;i<7;i++){

let currentDate = new Date(today)

currentDate.setDate(today.getDate()+i)

let endTime = new Date()

endTime.setDate(today.getDate()+i)

endTime.setHours(21,0,0,0)

if(today.getDate() === currentDate.getDate()){

currentDate.setHours(currentDate.getHours()>10 ? currentDate.getHours()+1 : 10)

currentDate.setMinutes(currentDate.getMinutes()>30 ? 30 : 0)

}

else{

currentDate.setHours(10)

currentDate.setMinutes(0)

}

let timeSlots = []

while(currentDate < endTime){

let formattedTime = currentDate.toLocaleTimeString([],{
hour:'2-digit',
minute:'2-digit'
})

let day = currentDate.getDate()
let month = currentDate.getMonth()+1
let year = currentDate.getFullYear()

const slotDate = day+"_"+month+"_"+year
const slotTime = formattedTime

const isSlotAvailable = docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ? false : true

if(isSlotAvailable){

timeSlots.push({
datetime:new Date(currentDate),
time:formattedTime
})

}

currentDate.setMinutes(currentDate.getMinutes()+30)

}

setDocSlots(prev => [...prev,timeSlots])

}

}

/* ---------------- BOOK APPOINTMENT ---------------- */

const bookAppointment = async () => {

if(!token){

toast.warn("Login to book appointment")

navigate('/login')

return

}

if(!slotTime){

toast.error("Please select time slot")

return

}

if(!docId){

toast.error("Doctor ID missing")

return

}

try{

const date = docSlots[slotIndex][0].datetime

let day = date.getDate()
let month = date.getMonth()+1
let year = date.getFullYear()

const slotDate = day+"_"+month+"_"+year

const {data} = await axios.post(

backendUrl + "/api/user/book-appointment",

{
docId,
slotDate,
slotTime
},

{
headers:{token}
}

)

if(data.success){

toast.success("Appointment booked successfully")

getDoctorsData()

navigate("/my-appointments")

}

else{

toast.error(data.message)

}

}

catch(error){

console.log(error)

toast.error("Booking failed")

}

}

/* ---------------- HISTORY INPUT ---------------- */

const handleHistoryChange = (e) => {

setHistoryData({
...historyData,
[e.target.name]:e.target.value
})

}

/* ---------------- SUBMIT HISTORY ---------------- */

const submitHistoryAndBook = async () => {

try{

if(historyData.doctorName !== ''){

await axios.post(

backendUrl + "/api/history/submit-history",

{
docId,
doctorName:historyData.doctorName,
disease:historyData.disease,
tablets:historyData.tablets,
notes:historyData.notes
},

{
headers:{token}
}

)

}

setShowHistoryForm(false)

setShowHistoryPopup(false)

bookAppointment()

}

catch(error){

console.log(error)

toast.error("History save failed")

}

}

useEffect(()=>{
fetchDocInfo()
},[doctors,docId])

useEffect(()=>{
if(docInfo){
getAvailableSlots()
}
},[docInfo])

return docInfo && (

<div>

<button

onClick={()=>setShowHistoryPopup(true)}

className='bg-primary text-white px-10 py-3 rounded-full'

>

Book an appointment

</button>

</div>

)

}

export default Appointment