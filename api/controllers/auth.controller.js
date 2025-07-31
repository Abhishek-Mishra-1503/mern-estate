import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';

export const signup=async (req,res)=>{
    const{username,email,password}=req.body;

    const hashedPassword = bcryptjs.hashSync(password, 10);  // we dont want to send the password as it is to the backend so we encrypt it

    const newUser = new User({username,email,password: hashedPassword});

    try{

    await newUser.save()  // save the user to the db. It takes time to save so we use await and as we have used await so we have to make the function async. Using await causes the code to stay in line 7 untill its completely exexuted and then go to next line

    res.status(201).json("User created succesfully");
    }catch(error){
        res.status(500).json(error.message);
    }

    // we wnat that if any error occurs than it should send the error to user and not show the error in the terminal

};

// from auth page we will get 3 data from body as request i.e. username, email and passwd so we will store them in the above three variables and store them in the user schema we created then we tell server to send status code and a json as response to confirm i.e Respond to the client with HTTP status 201 Created, and send the text "User created successfully" as JSON.