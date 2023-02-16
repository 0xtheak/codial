const queue = require('../config/kue');
const passwordReset = require('../mailers/password_reset_mailer');


queue.process('password-reset', (job, done)=>{
    console.log('password reset worker processing the job ');
    passwordReset.passwordReset(job.data);
    done();
})