require('dotenv').config()
const nodemailer = require("nodemailer");


let sendSimpleEmail = async (dataSend) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"BookingCare👻" <quanghungdo.vp@gmail.com>', // sender address
        to: dataSend.reciverEmail, // list of receivers
        subject: "Thông tin đặt lịch khám bênh ✔", // Subject line
        // text: "Hello world?", // plain text body
        html: `
            <h3>Xin chào ${dataSend.fullName}</h3>
            <p>Cảm ơn bạn đã đặt lịch khám bệnh online trên BookingCare</p>
            <p>Thông tin đặt lịch khám bệnh của bạn:</p>
            <div><b>Thời gian: ${dataSend.time}</b></div>
            <p>Chúng tôi sẽ tạo lịch khám của bạn với bác sĩ sau khi bạn click xác nhận với hệ thống</p>
            <a href='${dataSend.verifyLink}' target="_blank">Xác nhận</a>
            <p>Mọi thông tin hỏi đáp xin gửi về địa chỉ: </p>
            <div><b>Email: bookingcare@gmail.com</b></div>
            <div><b>SĐT: 0966149309</b></div>

        `, // html body
    });
}


let sendBillEmail = async (dataSend) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"BookingCare👻" <quanghungdo.vp@gmail.com>', // sender address
        to: dataSend.reciverEmail, // list of receivers
        subject: "Thông tin khám bênh ✔", // Subject line
        // text: "Hello world?", // plain text body
        html: `
            <h3>Xin chào ${dataSend.fullName}</h3>
            <p>Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ trên BookingCare</p>
            <p>Chúng tôi luôn muốn mang đến trải nghiệm dịch vụ tốt nhất cho bạn</p>
            <p>Nếu có bất cứ thắc mắc hoặc góp ý xin hãy liên hệ với chúng tôi</p>
            <div><b>Email: bookingcare@gmail.com</b></div>
            <div><b>SĐT: 0966149309</b></div>
            <p>BookingCare xin kính chúc bạn thật nhiều sức khỏe! </p>

        `, // html body
    });
}

module.exports = {
    sendSimpleEmail: sendSimpleEmail,
    sendBillEmail: sendBillEmail
}