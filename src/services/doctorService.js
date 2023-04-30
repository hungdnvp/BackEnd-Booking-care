import db from '../models/index';

let getTopDoctorService = (limitInput) =>{
    return new Promise(async (resolve, reject) => {
        try{
            let users = await db.User.findAll({
                limit: limitInput,
                where: {roleId: 'R2'},
                order: [['createdAt','DESC']],
                attributes:{
                    exclude: ['password']
                },
                include: [
                    {model: db.Allcode, as: 'positionData', attributes: ['valueEn','valueVi']},
                    {model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi']}
                ],
                raw: true,
                nest: true
            })

            resolve({
                errCode: 0,
                errMessage: 'OK',
                data: users
            })
        }catch(e){
            reject(e);
        }
    })
}

let getAllDoctor = ()=>{
    return new Promise( async (resolve, reject) =>{
        try{
            let doctors = await db.User.findAll({
                where: {roleId: 'R2'},
                attributes: {
                    exclude: ['password', 'image']
                }
            })

            resolve({
                errCode: 0,
                errMessage: 'get doctor success',
                doctors: doctors
            })
        }catch(e){

        }
    })
}
let saveInforDoctorService = (inputData)=>{
    return new Promise( async (resolve, reject)=>{
        try{
            if(!(inputData.doctorId || inputData.contentHTML|| inputData.contentMarkdown)){
                resolve({
                    errCode: 1,
                    errMessage: 'Missing require parameter'
                })
            }else{
                let checkDoctor = await db.Markdown.findOne({
                    where: {doctorId: inputData.doctorId}
                })
                if(checkDoctor){  // check markdown exist
                    await db.Markdown.update({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                    },{
                        where: {doctorId: inputData.doctorId}
                    })
                }else{
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId
                    })
                }

                resolve({
                    errCode: 0,
                    errMessage: 'save infor doctor successed'
                })
            }
        }catch(e){
            reject(e)
        }
    })
}

let getDetailDoctorService = (inputId)=>{
    return new Promise( async (resolve, reject) =>{
        try{
            if(!inputId){
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            }else{
                let data = await db.User.findOne({
                    where: {id : inputId},
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentHTML', 'contentMarkdown'] 
                        },
                        {
                            model: db.Allcode,
                            as: 'positionData',
                            attributes: ['valueEn','valueVi']
                        }
                    ],
                    raw: true,
                    nest: true
                })

                resolve({
                    errCode: 0,
                    data: data
                })
            }
            
        }catch(e){
            reject(e);
        }
    })
}
module.exports = {
    getTopDoctorService: getTopDoctorService,
    getAllDoctor: getAllDoctor,
    saveInforDoctorService: saveInforDoctorService,
    getDetailDoctorService: getDetailDoctorService
}