const Post = require('../models/posts');
const Comment = require('../models/comment');
const Like = require('../models/like');


module.exports.toggleLike = async function(req, res){
    try{

        //  like/toggle/?id=abcd&type=Post
        let likeable;
        let deleted = false;

        if(req.query.type == 'Post'){
            likeable = await Post.findById(req.query.id).populate('likes');

        }else {
            likeable = await Comment.findById(req.query.id).populate('likes');
        }
        console.log(likeable);

        // check if already like exits
        let existingLike = await Like.findOne({
            likeable : req.query.id,
            onModel : req.query.type,
            user : req.user._id
        });

        // if a like already exist the delete it or create a new like
        if(existingLike){
            likeable.likes.pull(existingLike._id);
            likeable.save();
            existingLike.remove();
            deleted = true;

        }else {
            // else make a new like
            let newLike  = await Like.create({
                user : req.user._id,
                likeable : req.query.id,
                onModel : req.query.type
            });
            likeable.likes.push(newLike._id);
            likeable.save();
        }

        return res.status(200).json({
            message : "Request Successfull",
            data : {
                deleted,
            }
        })


    }catch(err){
        console.log(err);
        return res.status(500).json({
            message : "Internal Server Error"
        });
    }
}