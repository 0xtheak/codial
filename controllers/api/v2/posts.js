module.exports.index= function(req, res){
    return res.status(200).json({
        meessage : "List of posts",
        posts : []
    });
}