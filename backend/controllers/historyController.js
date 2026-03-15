import historyModel from "../models/historyModel.js"

export const submitHistory = async(req,res)=>{

try{

const {docId,doctorName,disease,tablets,notes} = req.body

const userId = req.userId

if(!docId){

return res.json({
success:false,
message:"docId is required"
})

}

const history = new historyModel({

userId,
docId,
doctorName,
disease,
tablets,
notes

})

await history.save()

res.json({
success:true,
message:"History saved"
})

}

catch(error){

console.log(error)

res.json({
success:false,
message:"Server error"
})

}

}