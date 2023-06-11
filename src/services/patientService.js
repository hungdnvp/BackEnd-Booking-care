import db from '../models/index';
require('dotenv').config();
import _, { reject } from "lodash"
import emailService from './emailService';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';


let postBookAppointmentService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.date
                || !data.timeType || !data.fullName || !data.timeTypeData) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required paramenter"
                })
            } else {
                // upsert patient
                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: 'R3'
                    }
                })

                //upsert a booking record
                let token = uuidv4()
                let booking = await db.Booking.findOrCreate({
                    where: { doctorId: data.doctorId, date: data.date, timeType: data.timeType },
                    defaults: {
                        statusId: 'S1',
                        doctorId: data.doctorId,
                        patientId: user[0].id,
                        date: data.date,
                        timeType: data.timeType,
                        token: token
                    }
                })
                if (!booking[1]) {
                    resolve({
                        errCode: 2,
                        errMessage: "Can't douple booking",
                    })
                } else {
                    // send verify Email
                    let datebooking = moment.unix(+ data.date / 1000).format('dddd - DD/MM/YYYY')
                    // build Link verifyLink Email

                    let verifyLink = `${process.env.URL_FONTEND}/api/verify_booking?token=${token}&doctorId=${data.doctorId}`
                    await emailService.sendSimpleEmail({
                        reciverEmail: data.email,
                        fullName: data.fullName,
                        time: data.timeTypeData + ' ,ngày ' + datebooking,
                        verifyLink: verifyLink
                    })
                    resolve({
                        errCode: 0,
                        errMessage: "Save infor paitent success",
                    })
                }
            }

        } catch (e) {
            reject(e)
        }
    })
}
let getVerifyBookingService = (token, doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let booking = await db.Booking.findOne({
                where: {
                    token: token,
                    doctorId: doctorId,
                    statusId: 'S1'
                },
                raw: true
            })
            if (booking) {
                await db.Booking.update({
                    statusId: 'S2'
                }, {
                    where: { id: booking.id }
                })
                resolve({
                    errCode: 0,
                    errMessage: "Update the booking succedd !"
                })
            } else {
                resolve({
                    errCode: 1,
                    errMessage: "Booking has been activated or doesn't exist!"
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}
module.exports = {
    postBookAppointmentService: postBookAppointmentService,
    getVerifyBookingService: getVerifyBookingService
}