const nodemailer = require('../config/nodemailer');

// this is another way of exporting a method
exports.newComment = (comment) => {
    let htmlString = nodemailer.renderTemplate({comment : comment}, '/comments/new_comments.ejs');

    nodemailer.tranporter.sendMail({
        from : 'khanaamirak135@gmail.com',
        to : comment.user.email,
        subject : 'New Comment published',
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