import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors';
import { toast } from 'react-toastify';
import axios from 'axios';

const Appointment = () => {

const { docId } = useParams();
const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext);
const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

const navigate = useNavigate()

const [docInfo, setDocInfo] = useState(null);
const [docSlots, setDocSlots] = useState([]);
const [slotIndex, setSlotIndex] = useState(0);
const [slotTime, setSlotTime] = useState('');

/* -------- NEW STATES FOR HISTORY FEATURE -------- */

const [showHistoryPopup, setShowHistoryPopup] = useState(false)
const [showHistoryForm, setShowHistoryForm] = useState(false)

const [historyData, setHistoryData] = useState({
doctorName: '',
disease: '',
tablets: '',
notes: ''
})

/* ----------------------------------------------- */

const fetchDocInfo = async () => {
const docInfo = doctors.find(doc => doc._id === docId)
setDocInfo(docInfo);
}

const getAvailableSlots = async () => {

setDocSlots([]);

let today = new Date();

for (let i = 0; i < 7; i++) {

  let currentDate = new Date(today)
  currentDate.setDate(today.getDate() + i)

  let endTime = new Date();
  endTime.setDate(today.getDate() + i);
  endTime.setHours(21, 0, 0, 0);

  if (today.getDate() === currentDate.getDate()) {
    currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
    currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
  } else {
    currentDate.setHours(10)
    currentDate.setMinutes(0)
  }

  let timeSlots = [];

  while (currentDate < endTime) {

    let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    let day = currentDate.getDate()
    let month = currentDate.getMonth() + 1
    let year = currentDate.getFullYear()

    const slotDate = day + "_" + month + "_" + year
    const slotTime = formattedTime

    const isSlotAvailable =
      docInfo.slots_booked[slotDate] &&
      docInfo.slots_booked[slotDate].includes(slotTime)
        ? false
        : true

    if (isSlotAvailable) {

      timeSlots.push({
        datetime: new Date(currentDate),
        time: formattedTime
      })

    }

    currentDate.setMinutes(currentDate.getMinutes() + 30)

  }

  setDocSlots(prev => ([...prev, timeSlots]))
}

}

/* ---------------- ORIGINAL BOOK APPOINTMENT FUNCTION ---------------- */

const bookAppointment = async () => {

if (!token) {
  toast.warn('Login to book appointment')
  return navigate('/login')
}

try {

  const date = docSlots[slotIndex][0].datetime

  let day = date.getDate()
  let month = date.getMonth() + 1
  let year = date.getFullYear()

  const slotDate = day + "_" + month + "_" + year

  const { data } = await axios.post(
    backendUrl + '/api/user/book-appointment',
    { docId, slotDate, slotTime },
    { headers: { token } }
  )

  if (data.success) {

    toast.success(data.message)
    getDoctorsData()
    navigate('/my-appointments')

  } else {
    toast.error(data.message)
  }

} catch (error) {

  console.log(error.message)
  toast.error(error.message)

}


}

/* ---------------- HISTORY INPUT HANDLER ---------------- */

const handleHistoryChange = (e) => {

setHistoryData({
  ...historyData,
  [e.target.name]: e.target.value
})

}

/* ---------------- SUBMIT HISTORY + BOOK APPOINTMENT ---------------- */

const submitHistoryAndBook = async () => {

try {

  if (historyData.doctorName !== '') {

    await axios.post(
      backendUrl + "/api/history/submit-history",
      {
        docId,
        doctorName: historyData.doctorName,
        disease: historyData.disease,
        tablets: historyData.tablets,
        notes: historyData.notes
      },
      { headers: { token } }
    )

  }

  setShowHistoryForm(false)
  setShowHistoryPopup(false)

  bookAppointment()

} catch (error) {

  console.log(error)

}


}

useEffect(() => {
fetchDocInfo()
}, [doctors, docId])

useEffect(() => {
if (docInfo) {
getAvailableSlots()
}
}, [docInfo])

useEffect(() => {
console.log(docSlots);
}, [docSlots])

return docInfo && ( <div>

  {/* Doctor Details */}

  <div className='flex flex-col sm:flex-row gap-4'>

    <div>
      <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt="" />
    </div>

    <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>

      <p className='flex item-center gap-2 text-2xl font-medium text-gray-900'>
        {docInfo.name}
        <img className='w-5' src={assets.verified_icon} alt="" />
      </p>

      <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
        <p>{docInfo.degree}-{docInfo.speciality}</p>
        <button className='py-0.5 px-2 border text-xs rounded-full'>
          {docInfo.experience}
        </button>
      </div>

      <div>
        <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
          About <img src={assets.info_icon} alt="" />
        </p>
        <p className='text-sm text-gray-500 max-w-[700px] mt-1'>
          {docInfo.about}
        </p>
      </div>

      <p className='text-gray-500 font-medium mt-4'>
        Appointment fee:
        <span className='text-gray-600'>
          {currencySymbol}{docInfo.fees}
        </span>
      </p>

    </div>

  </div>

  {/* Booking Slots */}

  <div className='sm-ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>

    <p>Booking slots</p>

    <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>

      {
        docSlots.length && docSlots.map((item, index) => (

          <div
            onClick={() => setSlotIndex(index)}
            className={`text-center py-6 min-w-16 rounded-full cursor-pointer
            ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'}`}
            key={index}
          >

            <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
            <p>{item[0] && item[0].datetime.getDate()}</p>

          </div>

        ))
      }

    </div>

    <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>

      {docSlots.length && docSlots[slotIndex].map((item, index) => (

        <p
          onClick={() => setSlotTime(item.time)}
          className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer
          ${item.time === slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-300'}`}
          key={index}
        >

          {item.time.toLowerCase()}

        </p>

      ))}

    </div>

    {/* MODIFIED BUTTON (ONLY ADDITION) */}

    <button
      onClick={() => setShowHistoryPopup(true)}
      className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6'
    >
      Book an appointment
    </button>

  </div>

  <RelatedDoctors docId={docId} speciality={docInfo.speciality} />

  {/* HISTORY QUESTION POPUP */}

  {showHistoryPopup && (

    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">

      <div className="bg-white p-6 rounded-lg w-[400px]">

        <h2 className="text-lg font-semibold mb-4">
          Previously consulted any doctor?
        </h2>

        <div className="flex gap-4">

          <button
            onClick={() => {
              setShowHistoryPopup(false)
              bookAppointment()
            }}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            No
          </button>

          <button
            onClick={() => {
              setShowHistoryPopup(false)
              setShowHistoryForm(true)
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Yes
          </button>

        </div>

      </div>

    </div>

  )}

  {/* HISTORY FORM */}

  {showHistoryForm && (

    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">

      <div className="bg-white p-6 rounded-lg w-[500px]">

        <h2 className="text-lg font-semibold mb-4">
          Previous Consultation Details
        </h2>

        <div className="flex flex-col gap-3">

          <input
            type="text"
            name="doctorName"
            placeholder="Previous Doctor Name"
            value={historyData.doctorName}
            onChange={handleHistoryChange}
            className="border p-2 rounded"
          />

          <input
            type="text"
            name="disease"
            placeholder="Disease diagnosed"
            value={historyData.disease}
            onChange={handleHistoryChange}
            className="border p-2 rounded"
          />

          <input
            type="text"
            name="tablets"
            placeholder="Tablets taken"
            value={historyData.tablets}
            onChange={handleHistoryChange}
            className="border p-2 rounded"
          />

          <textarea
            name="notes"
            placeholder="Additional notes"
            value={historyData.notes}
            onChange={handleHistoryChange}
            className="border p-2 rounded"
          />

          <div className="flex gap-3 mt-3">

            <button
              onClick={submitHistoryAndBook}
              className="bg-primary text-white px-4 py-2 rounded"
            >
              Submit & Book
            </button>

            <button
              onClick={() => setShowHistoryForm(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>

          </div>

        </div>

      </div>

    </div>

  )}

</div>

)
}

export default Appointment
