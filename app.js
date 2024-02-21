const express = require('express');
const bodyParser = require('body-parser');

//STEP 1 import Mongoose 
const Mongoose = require('mongoose');

const placesRoutes = require('./routes/places-routes');
// const usersRoutes = require("./routes/users-routes");
const { default: mongoose } = require('mongoose');

const app = express(); 
const cors = require('cors')
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const path = require('path')

app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(fileUpload({
    useTempFiles: true
}))

// // Routes
app.use('/user', require('./routes/userRouter'))
app.use('/api', require('./routes/order-router'))
app.use('/api', require('./routes/categoryRouter'))
// app.use('/api', require('./routes/upload'))
app.use('/api', require('./routes/productRouter'))
// app.use('/api', require('./routes/paymentRouter'))

//STEP 1 add a new MiddleWare that parses the data
//routes are read top to bottom
//first parse the body then reach the routes
//NOTE: bodyParser.JSON will parse any JSON data and desearlize into JavaScript
//then it will call NEXT and fall into the next middleware which is "/api/places" 
app.use(bodyParser.json());

//add a new middleware function
//NOTE: the idea is that we do not send back a RESPONSE, but we add certain HEADERS to the RESPONSE
// app.use((req,res,next)=> {

//     //this allows us to control which domains have access to these resources
//     res.setHeader("Access-Control-Allow-Origin", "*");

//     //this controls which headers are allows
//     res.setHeader(
//         "Access-Control-Allow-Headers",
//         "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//     );

//     //this basically controls which HTTP methods can be used on the FRONTEND
//     res.setHeader('Access-Control-Allow-Methods','GET, POST, PATCH, DELETE');

//     //move the next middleware
//     next();


// });


app.use('/api/places', placesRoutes); 
// app.use("/api/users", usersRoutes);


app.use((error, req, res,next) => {

        if(res.headerSent) {
            return next(error);
        }
        res.status(error.code || 500);  
        res.json( { message: error.message || 'An unknown error occured'  });

});

//STEP 2
//mongoose.connect().then().catch();
const url = 'mongodb+srv://naraga65:naraga65@cluster0.uzepdul.mongodb.net/project?retryWrites=true&w=majority';
mongoose.connect(url).then(()=> {
    //if connection was successful then we start our backend server
    console.log("Mongodb server connected!!")
    app.listen(3001);
}).catch(err => {
    console.log(err);
});

//app.listen(3001);