import patientService from "../services/patientService";
const url = require('url');

let postBookAppointment = async (req,res)=>{
    try {
        let infor = await patientService.postBookAppointmentService(req.body)
        return res.status(200).json(infor)

    } catch (e) {
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }

}

let getVerifyBooking = async (req,res) =>{
    try{
        
        let token = req.query.token;
        let doctorId = req.query.doctorId;
        let check = await patientService.getVerifyBookingService(token,doctorId)
        return res.status(200).json(check)
    }catch(e){
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Error form server'
        })
    }
}
module.exports = {
    postBookAppointment: postBookAppointment,
    getVerifyBooking: getVerifyBooking
}

