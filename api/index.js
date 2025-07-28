import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();   // initializing dotenv

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("Connected to DB");
}).catch((err)=>{
    console.log(err);
});    //if no error than the 'then' part will run otherwise catch part will run

// as when we share the code we dont want our username and password of database to be visible to others so we add the connection string in the .env file. The .env file is ignored and not pushed in the git because we add the .env file name in the .gitignore file

// we cannot directly use a .env in the backend so we have to import the dotenv package to use it

const app=express();
  
app.listen(3000,()=>{
    console.log('Server is running on port 3000!')
})