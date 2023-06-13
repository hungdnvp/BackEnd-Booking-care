import db from '../models/index';

let createSpecialtyService = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imageBase64
                || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'missing required parameter'
                })
            } else {
                await db.Specialty.create({
                    name: data.name,
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
let getAllSpecialtyService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let specialties = await db.Specialty.findAll({

            })
            if (specialties && specialties.length > 0) {
                specialties.map(item=>{
                    item.image = new Buffer(item.image, "base64").toString('binary');
                    return item;
                })
            }
            resolve({
                errCode: 0,
                errMessage: 'get doctor success',
                specialties: specialties
            })
        } catch (e) {
            reject(e)
        }
    })
}
let getDetailSpecialtyService = (inputId)=>{
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findOne({
                where: {id: inputId},
                attributes: ['descriptionHTML','descriptionMarkdown']
            })
            if(data){
                let doctorSpecialty = await db.Doctor_Infor.findAll({
                    where: {
                        specialtyId: inputId
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
    createSpecialtyService: createSpecialtyService,
    getAllSpecialtyService: getAllSpecialtyService,
    getDetailSpecialtyService: getDetailSpecialtyService
}