(()=>{

    const express = require('express');
    const app=express()
    const path=require('path')
    const bodyParser=require('body-parser')
    const flash=require('connect-flash');
    const session=require('express-session')
    const passport=require('passport')
    const cookieParser=require('cookie-parser')
    const mongoose=require('mongoose')
    const setupPassport=require('./passport/setupPassport')
    
    mongoose.connect('mongodb+srv://uni_demo:3zR1bd84XW1Ik8jy@cluster0.zkia2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    {
        useNewUrlParser:   true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    setupPassport();
    
    app.use(bodyParser.urlencoded({extended:false}))
    
    app.use(bodyParser.json())
    
   
    app.set("views", path.join(__dirname, "views"));
   
    app.set("view engine", "ejs");
  
    app.use(cookieParser())
  
    app.use(session({
    secret: "LUp$Dg?,I#i&owP3=9su+OB%`JgL4muLF5YJ~{;t",
    resave: true,
    saveUninitialized: true
    }));
    
    app.use(flash());
    
    app.use(passport.initialize());
    
    app.use(passport.session());
    
    app.use(express.static(path.join(__dirname, "public")));
    
    const router=require('./routers/main')
    
    
    app.use('/',router)
    
    app.listen(3000,function(){
        console.log('App is running on port',3000)
    })
})
()