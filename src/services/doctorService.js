import db from '../models/index';
require('dotenv').config();
import _, { reject } from "lodash"
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;
import emailService from './emailService';


const { Op } = require("sequelize");
let getTopDoctorService = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limitInput,
                where: { roleId: 'R2' },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] }
                ],
                raw: true,
                nest: true
            })

            resolve({
                errCode: 0,
                errMessage: 'OK',
                data: users
            })
        } catch (e) {
            reject(e);
        }
    })
}

let getAllDoctor = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: {
                    exclude: ['password', 'image']
                }
            })

            resolve({
                errCode: 0,
                errMessage: 'get doctor success',
                doctors: doctors
            })
        } catch (e) {
            reject(e)
        }
    })
}
let saveInforDoctorService = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.doctorId || !inputData.contentHTML || !inputData.contentMarkdown || !inputData.action
                || !inputData.selectedPrice || !inputData.selectedPayment || !inputData.selectedProvince
                || !inputData.nameClinic || !inputData.addressClinic || !inputData.note || !inputData.specialtyId
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing require parameter'
                })
            } else {

                if (inputData.action == 'UPDATE') {  // check markdown exist
                    await db.Markdown.update({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                    }, {
                        where: { doctorId: inputData.doctorId }
                    })
                } else {
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId
                    })
                }
                // upsert doctor_infor
                let doctorCheck = await db.Doctor_Infor.findOne({
                    where: {
                        doctorId: inputData.doctorId,
                    }
                })
                if (doctorCheck) {
                    doctorCheck.priceId = inputData.selectedPrice
                    doctorCheck.paymentId = inputData.selectedPayment
                    doctorCheck.provinceId = inputData.selectedProvince
                    doctorCheck.nameClinic = inputData.nameClinic
                    doctorCheck.addressClinic = inputData.addressClinic
                    doctorCheck.note = inputData.note,
                        doctorCheck.specialtyId = inputData.specialtyId

                    await db.Doctor_Infor.update({
                        priceId: inputData.selectedPrice,
                        paymentId: inputData.selectedPayment,
                        provinceId: inputData.selectedProvince,
                        nameClinic: inputData.nameClinic,
                        addressClinic: inputData.addressClinic,
                        note: inputData.note,
                        specialtyId: inputData.specialtyId

                    }, {
                        where: { doctorId: inputData.doctorId }
                    })
                } else {
                    await db.Doctor_Infor.create({
                        doctorId: inputData.doctorId,
                        priceId: inputData.selectedPrice,
                        paymentId: inputData.selectedPayment,
                        provinceId: inputData.selectedProvince,
                        nameClinic: inputData.nameClinic,
                        addressClinic: inputData.addressClinic,
                        note: inputData.note,
                        specialtyId: inputData.specialtyId

                    })
                }
                resolve({
                    errCode: 0,
                    errMessage: 'save infor doctor successed'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getDetailDoctorService = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                let data = await db.User.findOne({
                    where: { id: inputId },
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
                            attributes: ['valueEn', 'valueVi']
                        },
                        {
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ['id', 'doctorId']
                            },
                            include: [
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEN', 'valueVI'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEN', 'valueVI'] },
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEN', 'valueVI'] }

                            ]
                        }
                    ],
                    raw: false,
                    nest: true
                })
                if (data && data.image) {
                    data.image = new Buffer(data.image, "base64").toString('binary');
                }
                if (!data) {
                    data = {}
                }
                resolve({
                    errCode: 0,
                    data: data
                })
            }

        } catch (e) {
            reject(e);
        }
    })
}
let bulkCreateScheduleService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data || data.length < 1) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing require parameter'
                })
            } else {
                let schedule = data.map(item => {
                    item.maxNumber = MAX_NUMBER_SCHEDULE;
                    return item;
                })
                // kiem tra cac ban ghi da ton tai
                let existing = await db.Schedule.findAll(
                    {
                        where: { doctorId: data[0].doctorId, date: data[0].date },
                        attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                        raw: true
                    }
                )
                // convert time
                if (existing && existing.length > 0) {

                    schedule = _.differenceWith(schedule, existing, (a, b) => {
                        return a.timeType === b.timeType && a.date === b.date;
                    })
                }

                if (schedule && schedule.length > 0) {
                    await db.Schedule.bulkCreate(schedule)
                }
                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                })
            }

        } catch (e) {
            reject(e);
        }
    })
}

let getScheduleByDateService = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Schedule.findAll({
                where: {
                    doctorId: doctorId,
                    date: date
                },
                include: [
                    {
                        model: db.Allcode, as: 'timeTypeData',
                        attributes: ['valueEN', 'valueVI']
                    }
                ],
                raw: false,
                nest: true
            })
            if (!data) data = []
            resolve({
                errCode: 0,
                data: data
            })
        } catch (e) {
            reject(e)
        }
    })
}
let getDetailDoctorExtraService = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: "error form server"
                })
            } else {
                let data = await db.Doctor_Infor.findOne({
                    where: {
                        doctorId: inputId
                    },
                    attributes: {
                        exclude: ['id', 'doctorId']
                    },
                    include: [
                        { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEN', 'valueVI'] },
                        { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEN', 'valueVI'] },
                        { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEN', 'valueVI'] }

                    ],
                    raw: false,
                    nest: true
                })
                if (!data) data = {}
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}
let getProfileDoctorService = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: "error form server"
                })
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: inputId
                    },
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
                            attributes: ['valueEn', 'valueVi']
                        },
                        {
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ['id', 'doctorId']
                            },
                            include: [
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEN', 'valueVI'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEN', 'valueVI'] },
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEN', 'valueVI'] }

                            ]
                        }
                    ],
                    raw: false,
                    nest: true
                })
                if (data && data.image) {
                    data.image = new Buffer(data.image, "base64").toString('binary');
                }
                if (!data) {
                    data = {}
                }
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}
let getListPatientService = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: "error form server"
                })
            } else {
                let data = await db.Booking.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date,
                        statusId: {
                            [Op.in]: ['S2', 'S3']
                          }
                        
                    },
                    include: [
                        {
                            model: db.User, as: 'patientData',
                            attributes: ['email', 'firstName', 'address', 'gender'],
                            include: [
                                { model: db.Allcode, as: 'genderData', attributes: ['valueEN', 'valueVI'] }
                            ]
                        },
                        {
                            model: db.Allcode, as: 'timeTypeDataBooking',
                            attributes: ['valueEN', 'valueVI']
                            
                        }],
                    raw: false,
                    nest: true

                })

                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let examineSuccessService = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.email || !inputData.bookingId || !inputData.firstName ){
                resolve({
                    errCode: 1,
                    errMessage: 'missing parameter'
                })
            }else{
                // update status booking
                await db.Booking.update({
                    statusId: 'S3'
                }, {
                    where: { id: inputData.bookingId }
                })
                // send mail bill

                await emailService.sendBillEmail({
                    reciverEmail: inputData.email,
                    fullName: inputData.firstName
                })
                resolve({
                    errCode: 0,
                    errMessage: 'verify examine success!'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}
module.exports = {
    getTopDoctorService: getTopDoctorService,
    getAllDoctor: getAllDoctor,
    saveInforDoctorService: saveInforDoctorService,
    getDetailDoctorService: getDetailDoctorService,
    bulkCreateScheduleService: bulkCreateScheduleService,
    getScheduleByDateService: getScheduleByDateService,
    getDetailDoctorExtraService: getDetailDoctorExtraService,
    getProfileDoctorService: getProfileDoctorService,
    getListPatientService: getListPatientService,
    examineSuccessService: examineSuccessService
}