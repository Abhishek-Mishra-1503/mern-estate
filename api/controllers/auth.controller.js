import User from '../models/user.model.js';
import {errorHandler} from '../utils/error.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signup=async (req,res,next)=>{
    const{username,email,password}=req.body;

    const hashedPassword = bcryptjs.hashSync(password, 10);  // we dont want to send the password as it is to the backend so we encrypt it

    const newUser = new User({username,email,password: hashedPassword});

    try{

    await newUser.save()  // save the user to the db. It takes time to save so we use await and as we have used await so we have to make the function async. Using await causes the code to stay in line 13 untill its completely exexuted and then go to next line

    res.status(201).json("User created succesfully");
    } 
    catch(error){
        next(error);
    }

    //  if any error occurs than catch will handle it and program run gracefully without getting terminatd

};

// from auth page we will get 3 data from body as request i.e. username, email and passwd so we will store them in the above three variables and store them in the user schema we created then we tell server to send status code and a json as response to confirm i.e Respond to the client with HTTP status 201 Created, and send the text "User created successfully" as JSON.


export const signin=async(req,res,next)=>{
    const {email,password}=req.body;
    try{
        const validUser = await User.findOne({email});      // we didnt wrote User.findOne({email: email}) because both key and value has same name
        // if found than validUser contains the whole MongoDB user document (all fields: id, email, username, hashed password, etc.).
        if(!validUser) return next(errorHandler(404, 'User not found!'));

        const validPassword = bcryptjs.compareSync(password,validUser.password);  // here the password we get from request is normal password and the one stored for the validUser if present in encrypted form so we use the compareSync function of bycrypt.js to compare the normal password received with the encrypted password stored for that validUser in DB. We dont compare the received password with all the passwords in DB because it is possible that two or more differnt user have same password
        if(!validPassword) return next(errorHandler(401, 'Wrong Credentials!'));

        // Now if both the email and password are valid then we need to authenticate the user. We do it by adding a cookiee inside the browser. Then we create a token that containes a unique credential of the user(it can be user's email or the user's ID that each user gets in MongoDB) and then we save this token inside the browser as cookie


        const token = jwt.sign({id:validUser.id},process.env.JWT_SECRET)  // Here we have used the id of the user for making the token and along with that we have created our own Secret key named as JWT_SECRET that will be unique for our application and make the token completely unique for our application. And we dont want the secret key to share with other so we store it in environmental variable. So here the user ID and the Secret key together form the token

        const {password: pass, ...rest} = validUser._doc  // here we destructured the validUser. one part contains the password field of validUser and its named as pass because password variable has already been used( we didnt wrote {password, ...rest}. we named the password filed of validUser as pass) and the other part named as rest contain all other fileds of validUser 
        // we destructured validUser._doc not validUser because it contains all the fileds including password

        res.cookie('access_token',token,{httpOnly: true}).status(200).json(rest);           // here we saved the token as cookie and add it inside the browser. we gave a name to it i.e access_token then pass the token and then add other informations. httpOnly:true means no other third party application can have access to our cookie to make it safer i.e cookie cannot be accessed by JS (prevents XSS attacks). we can also add expiry date for the cookie as {httpOnly: true, expires: newDate(Date.now() + 24*60*60*1000)}. In the response thier will also be the status code here 200 and the validUser data without password i.e. rest .

        // whenever the browser make any request to the server then the cookie will be send by browser that tells the server that the user is authentic and can access the resourses. Because HTTP is stateless — every request is independent, the server doesn’t “remember” who you are. Cookies fix that by letting the server identify the client across requests. When you log in, server generates a session ID (or JWT) and stores it in a cookie. On every future request, the browser sends that cookie → server checks it → knows you are the logged-in user. This way, you don’t need to re-enter username/password on every request. See the chat of Chat gpt for more knowledge

        // In the response we dont want the password even though it is encrypted so to remove it we destructure the valid user into two parts one conatins the password and the other conatins the remaining data and send only hte remaining data as response


    }
    catch(error){
        next(error);
    }
}