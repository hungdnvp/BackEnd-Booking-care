import clinicService from '../services/clinicService';


let createClinic = async (req,res)=>{
    try {
        let infor = await clinicService.createClinicService(req.body)
        return res.status(200).json(infor)

    } catch (e) {
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let getAllClinic = async (req,res)=>{
    try {
        let infor = await clinicService.getAllClinicService()
        return res.status(200).json(infor)

    } catch (e) {
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let getDetailClinic =  async (req,res)=>{
    try {
        let infor = await clinicService.getDetailClinicService(req.query.id)
        return res.status(200).json(infor)

    } catch (e) {
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
module.exports={
    createClinic: createClinic,
    getAllClinic: getAllClinic,
    getDetailClinic: getDetailClinic
}