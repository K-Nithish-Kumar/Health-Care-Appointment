import React from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { useEffect, useState, useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import axios from 'axios'

const DoctorAppointment = () => {

  const { dToken, appointments, getAppointments, completeAppointment, cancelAppointment, backendUrl } = useContext(DoctorContext)
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext)

  const [showForm, setShowForm] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)

  const [formData, setFormData] = useState({
    disease:'',
    notes:''
  })

  const [tablets,setTablets] = useState([
    {
      tabletName:'',
      morning:false,
      afternoon:false,
      night:false,
      food:'After Food',
      days:''
    }
  ])

  useEffect(()=>{

    if(dToken){
      getAppointments()
    }

  },[dToken])

  // open form
  const openPrescription = (appointment)=>{
    setSelectedAppointment(appointment)
    setShowForm(true)
  }

  // handle disease input
  const handleChange = (e)=>{
    setFormData({
      ...formData,
      [e.target.name]:e.target.value
    })
  }

  // add tablet row
  const addTablet = ()=>{
    setTablets([
      ...tablets,
      {
        tabletName:'',
        morning:false,
        afternoon:false,
        night:false,
        food:'After Food',
        days:''
      }
    ])
  }

  // tablet field change
  const handleTabletChange = (index,e)=>{

    const values = [...tablets]

    const {name,value,type,checked} = e.target

    values[index][name] = type === "checkbox" ? checked : value

    setTablets(values)

  }

  // submit prescription
  const submitPrescription = async (e)=>{

    e.preventDefault()

    try{

      await axios.post(backendUrl + "/api/prescription/add",{

        patientId:selectedAppointment.userData._id,
        doctorId:selectedAppointment.docData?._id,
        disease:formData.disease,
        tablets:tablets,
        notes:formData.notes

      })

      alert("Prescription Added")

      setShowForm(false)

      setFormData({disease:'',notes:''})

      setTablets([
        {
          tabletName:'',
          morning:false,
          afternoon:false,
          night:false,
          food:'After Food',
          days:''
        }
      ])

    }
    catch(error){

      console.log(error)

    }

  }

  return (
    <div className='w-full max-w-6xl m-5'>

      <p className='mb-3 text-lg font-medium'>All Appointments</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll'>

        <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {
          appointments.reverse().map((item,index)=>{

            return(
              <div key={index} className='flex flex-wrap justify-between max-sm:gap-5 sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50'>

                <p className='max-sm:hidden'>{index+1}</p>

                <div className='flex items-center gap-2'>
                  <img className='w-8 rounded-full' src={item.userData.image}/>
                  <p>{item.userData.name}</p>
                </div>

                <p className='text-xs border border-primary px-2 rounded-full'>
                  {item.payment ? "Online":"Cash"}
                </p>

                <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>

                <p>{slotDateFormat(item.slotDate)},{item.slotTime}</p>

                <p>{currency}{item.amount}</p>

                {
                  item.cancelled
                  ? <p className='text-red-400 text-xs'>Cancelled</p>

                  : item.isCompleted
                  ? <p className='text-green-500 text-xs'>Completed</p>

                  : <div className='flex items-center gap-2'>

                    <img onClick={()=>cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon}/>

                    <img onClick={()=>completeAppointment(item._id)} className='w-10 cursor-pointer' src={assets.tick_icon}/>

                    <button
                      onClick={()=>openPrescription(item)}
                      className='bg-blue-500 text-white px-2 py-1 rounded text-xs'
                    >
                      Add Prescription
                    </button>

                  </div>
                }

              </div>
            )

          })
        }

      </div>


      {/* PRESCRIPTION FORM */}

      {showForm && (

        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-40'>

          <div className='bg-white p-6 rounded-lg w-[600px]'>

            <h2 className='text-xl font-semibold mb-4'>Add Prescription</h2>

            <form onSubmit={submitPrescription} className='flex flex-col gap-4'>

              <input
                type="text"
                name="disease"
                placeholder="Disease"
                value={formData.disease}
                onChange={handleChange}
                className='border p-2 rounded'
                required
              />

              {tablets.map((tablet,index)=>(
                
                <div key={index} className='border p-3 rounded grid grid-cols-6 gap-2 items-center'>

                  <input
                    type="text"
                    name="tabletName"
                    placeholder="Tablet"
                    value={tablet.tabletName}
                    onChange={(e)=>handleTabletChange(index,e)}
                    className='border p-2 rounded'
                  />

                  <label className='flex items-center gap-1 text-sm'>
                    <input type="checkbox" name="morning"
                    checked={tablet.morning}
                    onChange={(e)=>handleTabletChange(index,e)} />
                    M
                  </label>

                  <label className='flex items-center gap-1 text-sm'>
                    <input type="checkbox" name="afternoon"
                    checked={tablet.afternoon}
                    onChange={(e)=>handleTabletChange(index,e)} />
                    A
                  </label>

                  <label className='flex items-center gap-1 text-sm'>
                    <input type="checkbox" name="night"
                    checked={tablet.night}
                    onChange={(e)=>handleTabletChange(index,e)} />
                    N
                  </label>

                  <select
                    name="food"
                    value={tablet.food}
                    onChange={(e)=>handleTabletChange(index,e)}
                    className='border p-2 rounded'
                  >
                    <option>Before Food</option>
                    <option>After Food</option>
                  </select>

                  <input
                    type="number"
                    name="days"
                    placeholder="Days"
                    value={tablet.days}
                    onChange={(e)=>handleTabletChange(index,e)}
                    className='border p-2 rounded'
                  />

                </div>

              ))}

              <button
                type="button"
                onClick={addTablet}
                className='bg-blue-500 text-white py-2 rounded'
              >
                + Add Tablet
              </button>

              <textarea
                name="notes"
                placeholder="Notes"
                value={formData.notes}
                onChange={handleChange}
                className='border p-2 rounded'
              />

              <div className='flex gap-3'>

                <button
                  type="submit"
                  className='bg-green-500 text-white px-4 py-2 rounded'
                >
                  Save
                </button>

                <button
                  type="button"
                  onClick={()=>setShowForm(false)}
                  className='bg-gray-400 text-white px-4 py-2 rounded'
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  )
}

export default DoctorAppointment
