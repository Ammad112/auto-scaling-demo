const UserModel=require('../models/User')

const StockModel=require('../models/Stock')

const app=require('express')

const bcrypt=require('bcryptjs')

const passport =require('passport')

const router=new app.Router()

function ensureAuthenticated(request, response, next) {
    if (request.isAuthenticated()) {
        next();
    } else {
      request.flash("info", "You must be logged in to see this page.");
     return response.redirect("/login");
    }
}

router.use(function(request, response, next) {
    response.locals.currentUser = request.user;
    response.locals.errors = request.flash("error");
    response.locals.infos = request.flash("info");
    next();
  });  
  

router.get('/',function(request,response,next){
    if(response.locals.currentUser){
        return  response.render('index')
    }
     response.render('index')
})

router.post('/stock',async function(request,response){
    try{

        const stockData=[
            {
            id:1,
            remaining:5
            },
            {
            id:2,
            remaining:5
            },
            {
            id:3,
            remaining:5
            },
            {
            id:4,
            remaining:5
            },
            {
            id:5,
            remaining:5
            },
            {
            id:6,
            remaining:5
            },
            {
            id:7,
            remaining:5
            },
            {
            id:8,
            remaining:5
            }
        ]
        for(let i = 0 ; i<stockData.length;i++){

            await StockModel.updateMany({stockId:stockData[i].id},
                {remaining:stockData[i].remaining},
                {upsert:true})
      
        }
        response.status(200).send({message:'Success'})
    }
    catch(error){
        response.status(500).send({message:error.message})
    }
})

router.put('/stock/:id',ensureAuthenticated, async function(request,response){
    try{
        
        const Stock=await StockModel.findOne({$and:[{stockId:request.params.id},{remaining:{$gte:1}}]})
        if(Stock){
            console.log(Stock.remaining)
            Stock.remaining=Stock.remaining-1
            await Stock.save()
            response.status(200).send({message:'It is successfully purchased'})
            return
        }
        response.status(404).send({message:'Out of stock'})   
   }
    catch(error){
        response.status(404).send({message:'Out of stock'})   
    }
})

router.get('/login',function(request,response,next){
    response.render('login')
})

router.post("/login",
passport.authenticate("login", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  })
  );
  

router.get("/logout", function(request, response) {
    request.logout();
    response.redirect("/");
});

router.get('/register',function(request,response,next){
    response.render('signup')
})

router.post('/register', async function(request,response){
    const user=await UserModel.findOne({email:request.body.email})
    if(user){
        response.status(409).send({message:'User already exist'})
        return
    }
    const newUser=new UserModel({
        email:request.body.email,
        fullName:request.body.fullName,
        password:await bcrypt.hashSync(request.body.password,10)

    })

    await newUser.save()
    request.flash('User has been successfully created')
    response.render('login')
 })

module.exports=router