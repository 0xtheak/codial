const queue = require('../config/kue');

const commentMailer = require('../mailers/comments_mailer');

queue.process('emails-comment', (job, done)=>{
    console.log("emails worker processing the job", job.data);
    commentMailer.newComment(job.data);

    done();
});
