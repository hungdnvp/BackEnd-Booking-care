
import doctorService from '../services/doctorService';
let getTopDoctor = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) limit = 10;
    try {
        let respone = await doctorService.getTopDoctorService(+limit);
        return res.status(200).json(respone);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getAllDoctor = async (req,res) =>{
    try{
        let data = await doctorService.getAllDoctor();
        res.status(200).json({
            errCode: data.errCode,
            errMessage: data.errMessage,
            data: data.doctors
        })
    }catch(e){
        console.log(e)
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let postInforDoctor = async (req,res) =>{
    try{
        let response = await doctorService.saveInforDoctorService(req.body);
        return res.status(200).json(response);
    }catch(e){
        console.log(e)
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getDetailDoctor = async (req, res) =>{
    try{
        let detail = await doctorService.getDetailDoctorService(req.query.id)
        return res.status(200).json(detail)
    }catch(e){
        console.log(e)
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
    getDetailDoctor: getDetailDoctor
}