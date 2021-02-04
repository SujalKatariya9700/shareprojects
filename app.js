var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const Bcrypt = require("bcryptjs");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var user = require("./app/usermodel");
var app = express();
var bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
var bcrypt = require('bcrypt-nodejs')

// var usersDB = require('usersDB');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
mongoose.connect('mongodb://localhost:27017/mongooseBD', {useNewUrlParser: true,useUnifiedTopology: true},(err, resp)=>{
  if(err) throw err;
  if(!resp) throw "invalid connnections";
  else "connenction established";
});

app.post("/signup",async(req, res)=>{
  let userData=await user.findOne({email:req.body.email})
  if (userData) {
    res.send({responseCode:404,responseMessage:"Email already exist"})
  }
  else{
    let hash=bcrypt.hashSync(req.body.password)
    let newObj = {
      userName:req.body.userName,
      email:req.body.email,
      password:hash,
      mobileNo:req.body.mobileNo
    };
        new user(newObj).save().then(resp=>{
          user.findOneAndUpdate({_id:resp._id},{createdBy:resp._id},{new:true},(error, response)=>{
            if(error) throw error;
            if(response){
              res.send({
                message:"signup successfull",
                data:response
              })
            }
          })
        }).catch(err=>{
          res.send({
            message:"err",
            data:err
          })
        })
  }
 
    
});
     ///////


////////
app.post("/login",(req, res)=>{
  user.findOne( {
    email:req.body.email,
    password:req.body.password
  },(err, resp)=>{
    if(err) throw err;
    if(resp){
      res.send({
        message:"Login successfull",
        data:resp
      });
    }else{
      res.send({
        message:"Invalid details"
      });
    }
  })
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
