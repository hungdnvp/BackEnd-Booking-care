import db from '../models/index';

let createClinicService = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imageBase64
                || !data.descriptionHTML || !data.descriptionMarkdown || !data.address) {
                resolve({
                    errCode: 1,
                    errMessage: 'missing required parameter'
                })
            } else {
                await db.Clinic.create({
                    name: data.name,
                    address: data.address,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown
                })
                resolve({
                    errCode: 0,
                    errMessage: 'ok'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}
let getAllClinicService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let clinics = await db.Clinic.findAll()
            if (clinics && clinics.length > 0) {
                clinics.map(item=>{
                    item.image = new Buffer(item.image, "base64").toString('binary');
                    return item;
                })
            }
            resolve({
                errCode: 0,
                errMessage: 'get doctor success',
                clinics: clinics
            })
        } catch (e) {
            reject(e)
        }
    })
}
let getDetailClinicService = (inputId)=>{
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinic.findOne({
                where: {id: inputId},
                attributes: ['descriptionHTML','descriptionMarkdown']
            })
            if(data){
                let doctorSpecialty = await db.Doctor_Infor.findAll({
                    where: {
                        specialtyId: 2 
                    },
                    attributes: ['doctorId']
                })
                
                data.doctorSpecialty = doctorSpecialty
            }else{
                data = {}
            }
            resolve({
                errCode: 0,
                errMessage: 'get doctor success',
                data: data
            })
        } catch (e) {
            reject(e)
        }
    })
}
module.exports = {
    createClinicService: createClinicService,
    getAllClinicService: getAllClinicService,
    getDetailClinicService: getDetailClinicService
}