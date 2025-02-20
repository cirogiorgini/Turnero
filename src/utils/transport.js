const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    secure: false,
    auth:{
        user: process.env.GMAIL_ACC,
        pass: process.env.GMAIL_PASS
    }
})

module.exports = transporter