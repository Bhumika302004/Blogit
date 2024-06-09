var express = require('express');
var router = express.Router();
const usermodel=require("./users");
const postmodel=require("./post");
const passport=require("passport");
const localStrategy=require("passport-local");
passport.use(new localStrategy(usermodel.authenticate()));
const upload=require("./multer");
/* GET home page. */
router.get('/signup', function(req, res, next) {
  res.render('index');
});
router.get('/login',function(req,res,next){
  res.render('login',{error:req.flash('error')});
});
router.get('/feed',function(req,res,next){
  res.render('feed');
});
router.post('/upload',isLoggedIn,upload.single("file"),async function(req,res,next){
  
  if(!req.file){
    return res.status(404).send("no files were given");
  }
   const user= await usermodel.findOne({username:req.session.passport.user});
   const post=await postmodel.create({
        image: req.file.filename,
        imagetext:req.body.filecaption,
        user:user._id
   });
   user.posts.push(post._id);
   await user.save();
   res.redirect("/profile");
});
router.get('/profile',isLoggedIn,async function(req,res){
  const user=await usermodel.findOne({
    username:req.session.passport.user,
  })
  .populate("posts");
  console.log(user);
    res.render('profile',{user});
  });

router.post('/register',function(req,res){
  try{
  const userdata=new usermodel({
       username:req.body.username,
       email:req.body.email,
       fullName:req.body.fullname
  });
usermodel.register(userdata,req.body.password)
  .then(function(registereduser){
      passport.authenticate("local")(req,res,function(){
        res.redirect('/profile');
      });
  })
.catch(function(err){
     if(err.name==='UserExistsError'){
      res.status(409).send("A user with the given username is already registered");
     }else{
      res.status(500).send("error in generating the user");
     }
});
}catch(err){
         res.status(500).send("server error");
}});

router.post('/checklogin',passport.authenticate("local",{
      successRedirect:"/profile",
      failureRedirect:"/login",
      failureFlash:true
    }),function(req,res){});
router.get('/logout',function(req,res,next){
    req.logout(function(err){
      if(err){
        return next(err);
      }
      res.redirect('/login');
    });
  });
function isLoggedIn(req,res,next){
   if(req.isAuthenticated()){
    return next();
   }
   res.redirect("/login");
 } 

module.exports = router;
