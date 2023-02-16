const User = require('../models/users');
const passwordResetMailer = require('../mailers/password_reset_mailer');
const passwordResetWorker = require('../workers/password_reset_worker');
const queue = require('../config/kue');

module.exports.resetPage = function(req, res){
    return res.render('forgot_password', {
        title : 'Reset password',
    });
}

module.exports.resetPassword = async function(req, res){
    try {

        let user = await User.findOne(req.body);
        if(user){
            console.log(user);
            
            passwordResetMailer.passwordReset(user);
            let job = queue.create('password-reset', user).save(function(err){
                if(err){
                    console.log('Error in creating password reset queue', err);
                }
                console.log(job.id);
            });
        }else {
            console.log('user is not in the database');
        }
        req.flash('success', "we'll send you reset mail, if you are registered with us");
        return res.redirect('back');

    }catch(err){
        console.log('Error in reseting password', err);
        return res.redirect('back');
    }
    
}