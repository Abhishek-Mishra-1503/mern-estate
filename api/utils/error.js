// the below is the error we have created. suppose we want that if password length is less than 8 that a error occurs so we created a error defined by us and we will provide it with a statuscode and message

export const errorHandler=(statusCode,message)=>{
    const error =new Error();   // we create a error using the Error constructor
    error.statusCode=statusCode;
    error.message=message;
    return error;
}