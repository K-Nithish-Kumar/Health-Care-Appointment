import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyAppointments = () => {

const { backendUrl, token, getDoctorsData } = useContext(AppContext)

const [appointments, setAppointments] = useState([])
const [prescription, setPrescription] = useState(null)
const [showPrescription, setShowPrescription] = useState(false)

const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

const slotDateFormat = (slotDate) => {
const dateArray = slotDate.split('_')
return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
}

const getUserAppointments = async () => {

try {

  const { data } = await axios.get(
    backendUrl + "/api/user/appointments",
    { headers: { token } }
  )

  if (data.success) {
    setAppointments(data.appointments.reverse())
  }

} catch (error) {
  console.log(error)
  toast.error(error.message)
}

}

const cancelAppointment = async (appointmentId) => {

try {

  const { data } = await axios.post(
    backendUrl + "/api/user/cancel-appointment",
    { appointmentId },
    { headers: { token } }
  )

  if (data.success) {
    toast.success(data.message)
    getUserAppointments()
    getDoctorsData()
  }

} catch (error) {
  console.log(error)
  toast.error(error.message)
}

}

const openPrescription = async (appointmentId) => {

try {

  const { data } = await axios.get(
    backendUrl + "/api/prescription/" + appointmentId,
    { headers: { token } }
  )

  if (data.success) {
    setPrescription(data.prescription)
    setShowPrescription(true)
  }

} catch (error) {
  console.log(error)
}

}

useEffect(() => {
if (token) {
getUserAppointments()
}
}, [token])

return ( <div>

  <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
    My appointments
  </p>

  <div>

    {appointments.map((item, index) => (

      <div
        className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b"
        key={index}
      >

        <div>
          <img
            className="w-32 bg-indigo-50"
            src={item.docData.image}
            alt=""
          />
        </div>

        <div className="flex-1 text-sm text-zinc-600">

          <p className="text-neutral-800 font-semibold">
            {item.docData.name}
          </p>

          <p>{item.docData.speciality}</p>

          <p className="text-zinc-700 font-medium mt-1">
            Address:
          </p>

          <p className="text-xs">
            {item.docData.address.line1}
          </p>

          <p className="text-xs">
            {item.docData.address.line2}
          </p>

          <p className="text-xs mt-1">
            <span className="text-sm text-neutral-700 font-medium">
              Date & Time:
            </span>{" "}
            {slotDateFormat(item.slotDate)} | {item.slotTime}
          </p>

        </div>

        <div className="flex flex-col gap-2 justify-end">

          {!item.cancelled && !item.isCompleted && !item.payment && (

            <button className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300">
              Pay Online
            </button>

          )}

          {!item.cancelled && !item.isCompleted && (

            <button
              onClick={() => cancelAppointment(item._id)}
              className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
            >
              Cancel appointment
            </button>

          )}

          {item.isCompleted && (

            <div className="flex items-center flex-col gap-2  ">

              <p className="text-green-500 text-sm font-medium">
                Completed
              </p>

              <button
                onClick={() => openPrescription(item._id)}
                className="text-sm text-blue-500 text-center sm:min-w-48 py-2 px-5 border rounded hover:bg-blue-600 hover:text-white transition-all duration-300"
              >
                View Prescription
              </button>

            </div>

          )}

          {item.cancelled && (

            <p className="text-red-500 text-sm font-medium mr-8">
              Appointment Cancelled
            </p>

          )}

        </div>

      </div>

    ))}

  </div>

  {showPrescription && prescription && (

    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">

      <div className="bg-white p-6 rounded-lg w-[500px] max-h-[80vh] overflow-y-scroll">

        <h2 className="text-xl font-semibold mb-4">
          Prescription
        </h2>

        <p>
          <b>Disease:</b> {prescription.disease}
        </p>

        <div className="mt-4">

          <h3 className="font-semibold mb-2">
            Medicines
          </h3>

          {prescription.tablets.map((tab, index) => (

            <div
              key={index}
              className="border p-2 rounded mb-2"
            >

              <p>
                <b>{tab.tabletName}</b>
              </p>

              <p>
                Timing :
                {tab.morning && " Morning "}
                {tab.afternoon && " Afternoon "}
                {tab.night && " Night "}
              </p>

              <p>
                Food : {tab.food}
              </p>

              <p>
                Days : {tab.days}
              </p>

            </div>

          ))}

        </div>

        <p className="mt-3">
          <b>Notes :</b> {prescription.notes}
        </p>

        <button
          onClick={() => setShowPrescription(false)}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          Close
        </button>

      </div>

    </div>

  )}

</div>

)

}

export default MyAppointments
