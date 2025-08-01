import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';  // we have exported as default so we can change the name while importing

import authRouter from './routes/user.auth.route.js';

dotenv.config();   // initializing dotenv

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("Connected to DB");
}).catch((err)=>{
    console.log(err);
});    //if no error than the 'then' part will run otherwise catch part will run

// as when we share the code we dont want our username and password of database to be visible to others so we add the connection string in the .env file. The .env file is ignored and not pushed in the git because we add the .env file name in the .gitignore file

// we cannot directly use a .env in the backend so we have to import the dotenv package to use it

const app=express();

app.use(express.json());  //by default we cannot send  json as input to the backend so this will allow to send json as input to the server
  
app.listen(3000,()=>{
    console.log('Server is running on port 3000!')
})

/*
app.get('/test',(req, res)=>{
    res.send('Hello world');
}) 
*/

// the above will create a api route at '/test; at port 3000.
// but if we make api routes for all the different routes than index.js become length so we create a seprate foulder for routes and import those routes 

app.use("/api/user", userRouter);   // the endpoint will be 3000/api/user/test.  it will go to the userRouter can check all the routes available 

app.use("/api/auth", authRouter);

// we below created a middleware that will handle all the error. As we will create multiple api routes so we will have to do error handling in all of them manually i.e. pass the message and status code for the error in the catch block. so to avoide it we create a middleware that will provide all this i.e. handle the error and give the info to the catch

// next is uded to go to the next middleware

app.use((err, req, res, next) => {

    const statusCode=err.statusCode || 500;  // store either the status code of the error that occured or store 500 as status code if we dont get any status code(500 is for internal server error). err.statusCode return the status code of the error stored in err

    const message = err.message || "Internal Server Error";

    // below we dont write statusCode:statusCode because if key and value name is same than we can write either and it will work. Same for message
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message,
});
});