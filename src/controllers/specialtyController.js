import specialtyService from "../services/specialtyService"
let createSpecialty = async (req,res)=>{
    try {
        let infor = await specialtyService.createSpecialtyService(req.body)
        return res.status(200).json(infor)

    } catch (e) {
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let getAllSpecialty = async (req,res)=>{
    try {
        let infor = await specialtyService.getAllSpecialtyService()
        return res.status(200).json(infor)

    } catch (e) {
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let getDetailSpecialty =  async (req,res)=>{
    try {
        let infor = await specialtyService.getDetailSpecialtyService(req.query.id)
        return res.status(200).json(infor)

    } catch (e) {
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
module.exports={
    createSpecialty: createSpecialty,
    getAllSpecialty: getAllSpecialty,
    getDetailSpecialty: getDetailSpecialty
}