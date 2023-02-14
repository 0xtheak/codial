const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');


let tranporter = nodemailer.createTransport({
    service : 'gmail',
    host : 'smtp.gmail.com',
    port : 587,
    secure : false,
    auth : {
        user : "khanaamirak135@gmail.com",
        pass : "foojkqoequrxjstt"
    }
});

let renderTemplate = (data, relativePath)=>{
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath),
        data,
        function(err, template){
            if(err){
                console.log('error in rendering template');
                return;
            }

            mailHTML = template;

        }
    )
    return mailHTML;
}


module.exports = {
    tranporter : tranporter,
    renderTemplate : renderTemplate,
}