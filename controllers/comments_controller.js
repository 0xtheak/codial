const Post = require('../models/posts');
const Comment = require('../models/comment');
const commentsMailer = require('../mailers/comments_mailer');
const commentEmailWorker = require('../workers/comment_email_worker');
const queue = require('../config/kue');
const Like = require('../models/like');

module.exports.comment =  async function(req, res){

    try {
        let post = await Post.findById(req.body.post);
        if(post){
           let comment =  await Comment.create({
                content : req.body.comment,
                user : req.user._id,
                post : req.body.post
            });

            post.comments.push(comment);
            post.save();
            comment = await comment.populate('user', 'name email');
            commentsMailer.newComment(comment);
            let job = queue.create('emails-comment', comment).save(function(err){
                if(err){
                    console.log('Error in creating email queue', err);
                }
                console.log(job.id);
            });
            

            if(req.xhr){
                

                return res.status(200).json({
                    data : {
                        comment : comment
                    },
                    message : "Post create"
                });
            }

            req.flash('success', "Comment Published")
            return res.redirect('/');
        }
    
    }catch(err) {
        console.log(err);
        req.flash('error', err);
        return res.redirect('back');
    }

    
  
}

module.exports.destroy = async function(req, res){

    try{
        let comment = await Comment.findById(req.params.id);
        if(comment.user == req.user.id){
            let postId = comment.post;
            comment.remove();
            Post.findByIdAndUpdate(postId, { $pull : {comments : req.params.id}});

            await Like.deleteMany({likeable : comment._id, onModel : 'Comment'});

            // send the comments id which was deleted back  to the views
            if(req.xhr){
                return res.status(200).json({
                    data : {
                        comment_id : req.params.id
                    },
                    message : "Post deleted"
                });
            }
            req.flash('success', 'Comment deleted!');
            return res.redirect('back');
        } else {
            return res.redirect('back');
        }

    }catch(err) {
        console.log(err);
        req.flash('error', 'Unauthorized');
        return res.redirect('back');

    }

   
}