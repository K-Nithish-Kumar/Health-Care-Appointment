import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const DoctorAppointment = () => {

const { dToken, appointments, getAppointments, cancelAppointment, completeAppointment, backendUrl } = useContext(DoctorContext)
const { calculateAge, slotDateFormat, currency } = useContext(AppContext)

const [showPrescription,setShowPrescription] = useState(false)
const [showHistory,setShowHistory] = useState(false)

const [selectedAppointment,setSelectedAppointment] = useState(null)
const [history,setHistory] = useState([])

const [date,setDate] = useState("")
const [disease,setDisease] = useState("")

const [tablets,setTablets] = useState([
{ name:"", morning:"", afternoon:"", night:"", food:"After Food" }
])

const openPrescriptionForm = (appointment)=>{
setSelectedAppointment(appointment)
setShowPrescription(true)
}

const addTablet = ()=>{
setTablets([
...tablets,
{ name:"", morning:"", afternoon:"", night:"", food:"After Food" }
])
}

const removeTablet = (index)=>{
const updated = tablets.filter((_,i)=>i!==index)
setTablets(updated)
}

const handleTabletChange = (index,field,value)=>{
const updated = [...tablets]
updated[index][field] = value
setTablets(updated)
}

const submitPrescription = async()=>{
try{

const {data} = await axios.post(
backendUrl + "/api/prescription/add",
{
appointmentId:selectedAppointment._id,
userId:selectedAppointment.userId,
date,
disease,
tablets
},
{headers:{dToken}}
)

if(data.success){
toast.success("Prescription Added")
setShowPrescription(false)

setDate("")
setDisease("")
setTablets([{ name:"", morning:"", afternoon:"", night:"", food:"After Food" }])
}

}catch(error){
console.log(error)
toast.error("Error saving prescription")
}
}

const viewHistory = async(userId)=>{
try{

const {data} = await axios.get(
backendUrl + "/api/patient-history/:patientId" + userId,
{headers:{dToken}}
)

if(data.success){
setHistory(data.prescriptions)
setShowHistory(true)
}

}catch(error){
console.log(error)
}
}

useEffect(()=>{
if(dToken){
getAppointments()
}
},[dToken])

return (

<div className="w-full max-w-7xl m-5">

<p className="mb-3 text-lg font-medium">All Appointments</p>

<div className="bg-white border rounded text-xs sm:text-sm max-h-[80vh] overflow-y-scroll overflow-x-auto">

<div className="grid grid-cols-[0.5fr_2fr_1fr_1fr_2fr_1fr_1fr_1fr_1fr] py-2 sm:py-3 px-3 sm:px-6 border-b min-w-[900px]">
<p>#</p>
<p>Patient</p>
<p>Payment</p>
<p>Age</p>
<p>Date & Time</p>
<p>Fees</p>
<p>Action</p>
<p>History</p>
<p>Prescription</p>
</div>

{appointments.reverse().map((item,index)=>(

<div key={index} className="grid grid-cols-[0.5fr_2fr_1fr_1fr_2fr_1fr_1fr_1fr_1fr] items-center py-2 sm:py-3 px-3 sm:px-6 border-b min-w-[900px]">

<p>{index+1}</p>

<div className="flex items-center gap-2">
<img className="w-7 sm:w-8 rounded-full" src={item.userData.image} alt="" />
<p className="whitespace-nowrap">{item.userData.name}</p>
</div>

<p>{item.payment ? "Online" : "Cash"}</p>

<p>{calculateAge(item.userData.dob)}</p>

<p className="whitespace-nowrap">
{slotDateFormat(item.slotDate)}, {item.slotTime}
</p>

<p>{currency}{item.amount}</p>

<div>

{item.cancelled ? (

<p className="text-red-500 text-xs font-medium">
Cancelled
</p>

) : item.isCompleted ? (

<p className="text-green-600 text-xs font-medium">
Completed
</p>

) : (

<div className="flex gap-2">

<img
onClick={()=>cancelAppointment(item._id)}
className="w-7 sm:w-8 cursor-pointer"
src={assets.cancel_icon}
alt=""
/>

<img
onClick={()=>completeAppointment(item._id)}
className="w-7 sm:w-8 cursor-pointer"
src={assets.tick_icon}
alt=""
/>

</div>

)}

</div>

<button
onClick={()=>viewHistory(item.userId)}
className="border border-blue-500 text-blue-500 px-3 sm:px-5 py-1 rounded text-xs hover:bg-blue-500 hover:text-white m-1 sm:m-2 whitespace-nowrap"
>

View History

</button>

<button
onClick={()=>openPrescriptionForm(item)}
className="border border-green-500 text-green-500 px-3 sm:px-5 py-1 rounded text-xs hover:bg-green-500 hover:text-white whitespace-nowrap"
>

Add Prescription

</button>

</div>

))}

</div>

{showPrescription && (

<div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">

<div className="bg-white p-6 rounded-lg w-[750px] max-h-[80vh] overflow-y-scroll">

<h2 className="text-lg font-semibold mb-4">Add Prescription</h2>

<input
type="date"
value={date}
onChange={(e)=>setDate(e.target.value)}
className="border p-2 rounded w-full mb-2"
/>

<input
type="text"
placeholder="Disease"
value={disease}
onChange={(e)=>setDisease(e.target.value)}
className="border p-2 rounded w-full"
/>

<p className="mt-4 font-medium">Tablets</p>

{tablets.map((tablet,index)=>(

<div key={index} className="grid grid-cols-6 gap-2 mt-2">

<input
type="text"
placeholder="Tablet Name"
value={tablet.name}
onChange={(e)=>handleTabletChange(index,"name",e.target.value)}
className="border p-2 rounded"
/>

<input
type="text"
placeholder="Morning"
value={tablet.morning}
onChange={(e)=>handleTabletChange(index,"morning",e.target.value)}
className="border p-2 rounded"
/>

<input
type="text"
placeholder="Afternoon"
value={tablet.afternoon}
onChange={(e)=>handleTabletChange(index,"afternoon",e.target.value)}
className="border p-2 rounded"
/>

<input
type="text"
placeholder="Night"
value={tablet.night}
onChange={(e)=>handleTabletChange(index,"night",e.target.value)}
className="border p-2 rounded"
/>

<select
value={tablet.food}
onChange={(e)=>handleTabletChange(index,"food",e.target.value)}
className="border p-2 rounded"

>

<option>Before Food</option>
<option>After Food</option>
</select>

<button
onClick={()=>removeTablet(index)}
className="bg-red-500 text-white rounded px-2"

>

Delete </button>

</div>

))}

<button
onClick={addTablet}
className="mt-3 bg-blue-500 text-white px-3 py-2 rounded"

>

Add Tablet </button>

<div className="flex gap-3 mt-4">

<button
onClick={submitPrescription}
className="bg-green-500 text-white px-4 py-2 rounded"

>

Save Prescription </button>

<button
onClick={()=>setShowPrescription(false)}
className="bg-gray-400 text-white px-4 py-2 rounded"

>

Cancel </button>

</div>

</div>

</div>

)}

{showHistory && (

<div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">

<div className="bg-white p-6 rounded-lg w-[600px] max-h-[80vh] overflow-y-scroll">

<h2 className="text-lg font-semibold mb-4">
Patient Prescription History
</h2>

{history.map((item,index)=>(

<div key={index} className="border p-3 rounded mb-3">

<p><b>Date:</b> {item.date}</p>
<p><b>Disease:</b> {item.disease}</p>

<p className="mt-2 font-medium">Tablets</p>

{item.tablets.map((t,i)=>(

<p key={i}>
{t.name} → M:{t.morning} A:{t.afternoon} N:{t.night} ({t.food})
</p>

))}

</div>

))}

<button
onClick={()=>setShowHistory(false)}
className="bg-red-500 text-white px-4 py-2 rounded"

>

Close </button>

</div>

</div>

)}

</div>

)

}

export default DoctorAppointment
