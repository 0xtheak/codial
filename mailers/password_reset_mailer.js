require('dotenv').config();
const nodemailer = require('../config/nodemailer');

// this is another way of exporting a method
exports.passwordReset = (user) => {
    let htmlString = nodemailer.renderTemplate({user : user}, '/passwordReset/password_reset.ejs');

    nodemailer.tranporter.sendMail({
        from : process.env.EMAIL,
        to : user.email,
        subject : 'Password Reset',
        html : htmlString
    },(err, info)=>{
        if(err){
            console.log('Error in sending mail', err);
            return ;
        }
        console.log('Message Sent', info);
        return;
    });
}