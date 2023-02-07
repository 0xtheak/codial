const User = require('../models/users');
const fs = require('fs');
const path = require('path');

module.exports.profile =  function(req, res){
    User.findById(req.params.id, (err, user) => {
        return res.render('users_profile', {
            title : "Profile",
            profile_user  : user
        });
    });
    
}

module.exports.update = async function(req, res){
    // if(req.user.id == req.params.id){
    //     User.findByIdAndUpdate(req.params.id, req.body, (err, user) => {
    //         return res.redirect('back');
    //     }); 
            
    // } else {
    //     return res.status(401).send('Unauthorized');
    // }

    if(req.user.id == req.params.id){
        try{
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err){
                if(err){
                    console.log('******multer file error', err);
                }
                user.name = req.body.name;
                user.email = req.body.email;
                console.log(req.file);
                if(req.file){
                    console.log(user.avatar);
                    

                    if(user.avatar){
                        let image_path = path.join(__dirname, '..', user.avatar);
                        if(fs.existsSync(image_path)){
                            fs.unlinkSync(image_path);
                        }
                    }

                    // this is saving the path of the uploaded file into the avatar field in the user
                    // console.log(user.avatarPath);
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                    
                }
                user.save();
                return res.redirect('back');

            });

        } catch(err){
            req.flash('error', err);
            return res.redirect('back');
        }

    }else{
        req.flash('error', 'Unauthorized');
        return res.status(401).send('Unauthorized');
    }
}

// render the sign up page
module.exports.signUp = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_up', {
        title : "Codial | Sign Up"
    });
}

// render the sign in page
module.exports.signIn = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title : "Codial | sign In"
    })
}


// get the sign up data
module.exports.create = function(req, res){
    console.log(req.body);
    if(req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }
    User.findOne({email : req.body.email}, (err, user) => {
        if(err){
            console.log('error in finding user in the sign up page');
            return;
        }
        if(!user){
            User.create(req.body, function(err, user){
                if(err) { console.log('error in creating user  while signing up'); return}

                return res.redirect('/users/sign-in');
            });
        } else {
            console.log('in the else');
             return res.redirect('back');
        }
    });
}

// sign in and create user session
module.exports.createSession = function(req, res){
    // // steps to authenticate
    // // find the user
    // User.findOne({email : req.body.email}, (err, user) => {
    //       if(err){console.log('error in find the user in the login page '); return;}

    // // handle user found
    //     if(user){
    // // handle password which don't match
    //         if(user.password != req.body.password ){
    //             return res.redirect('back');
    //         }
    //          // handle session creation
    //         res.cookie('user_id', user.id);
    //         return res.redirect('/users/profile');
    //     } else {
    //         // handle user not found
    //          return res.redirect('back');
    //       }
    // }); 
    req.flash('success', 'Logged in Successfully');

    return res.redirect('/');
}

module.exports.destroySession = function(req, res, next){
    req.logout((err) => {
        if(err){
            console.log('Failed to sign out');
            return next(err);
        }
        req.flash('success', 'You Have Logged out!');
        return res.redirect('/');
    });
    
}