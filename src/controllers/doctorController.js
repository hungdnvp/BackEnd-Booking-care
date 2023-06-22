
import doctorService from '../services/doctorService';
let getTopDoctor = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) limit = 10;
    try {
        let respone = await doctorService.getTopDoctorService(+limit);
        return res.status(200).json(respone);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getAllDoctor = async (req, res) => {
    try {
        let data = await doctorService.getAllDoctor();
        res.status(200).json({
            errCode: data.errCode,
            errMessage: data.errMessage,
            data: data.doctors
        })
    } catch (e) {
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let postInforDoctor = async (req, res) => {
    try {
        let response = await doctorService.saveInforDoctorService(req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getDetailDoctor = async (req, res) => {
    try {
        let detail = await doctorService.getDetailDoctorService(req.query.id)
        return res.status(200).json(detail)
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let bulkCreateSchedule = async (req, res) => {
    try {
        let infor = await doctorService.bulkCreateScheduleService(req.body)
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getScheduleByDate = async (req, res) => {
    try {
        let doctorId = req.query.doctorId
        let date = req.query.date
        if (!doctorId || !date) {
            return res.status(200).json({
                errCode: -1,
                errMessage: 'Missing required parameter'
            })
        } else {
            let infor = await doctorService.getScheduleByDateService(doctorId, date);
            return res.status(200).json(infor)
        }
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getDetailDoctorExtra = async (req, res) => {
    try {
        let infor = await doctorService.getDetailDoctorExtraService(req.query.doctorId)
        return res.status(200).json(infor.data)

    } catch (e) {
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getProfileDoctor = async (req, res) => {
    try {
        let infor = await doctorService.getProfileDoctorService(req.query.doctorId)
        return res.status(200).json(infor)

    } catch (e) {
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let getListPatient = async (req, res) => {
    try {
        let infor = await doctorService.getListPatientService(req.query.doctorId, req.query.date)
        return res.status(200).json(infor)

    } catch (e) {
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let examineSuccess = async (req, res) => {
    try {
        let response = await doctorService.examineSuccessService(req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

module.exports = {
    getTopDoctor: getTopDoctor,
    getAllDoctor: getAllDoctor,
    postInforDoctor: postInforDoctor,
    getDetailDoctor: getDetailDoctor,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
    getDetailDoctorExtra: getDetailDoctorExtra,
    getProfileDoctor: getProfileDoctor,
    getListPatient: getListPatient,
    examineSuccess: examineSuccess
}