import React, {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const {loading, error} = useSelector((state)=> state.user) // previously here we had const [error, setError]=useState(null); const [loading, setLoading]= useState(false); to get the initial state but now we use redux and get state from the global state named user defined in userSlice
   
  const navigate=useNavigate();

  const dispatch=useDispatch();

  const handleChange=(e)=>{
    setFormData(
      {
        ...formData,
        [e.target.id]: e.target.value,
      })
      console.log(formData);
  }

  const handleSubmit=async (e)=>{
    e.preventDefault();     // this prevents the sign up page from refreshing whenever we click sign up. The data (username,email,passwd) get submitted but the page does not get refreshed.
   
    // the client runs on the port 5173 and the backend(api) runs on port 3000 so we have to give the complete address i.e. 'http://localhost:3000/api/auth/signup' . So to fix this we create a proxy server in the vite.config for /api i.e. when we get /api it is replaced with 'http://localhost:3000'
     try{
    dispatch(signInStart());     // here  we previously had setLoading(true)
    const res=await fetch('/api/auth/signin',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify(formData),              // we didnt directly send formData i.e. fetch('/api/auth/sign-up', formData) instead we created a object and inside it we converted it to JSON string and send it.
    });
    const data = await res.json(); //converted the res to json

    if(data.success==false){
      dispatch(signInFailure(data.message));       // here we are using redux. previously we were doing setError(data.message);setLoading(false); but in place of this line but not we have defined all of it in the signInFailure and dispached it here
      return;
    }
    dispatch(signInSuccess(data));     // here we use redux. previously we were doing setLoading(false); setError(null);but in place of this line but not we have defined all of it in the signInSuccess and dispached it here
    navigate('/');
  }catch{
    dispatch(signInFailure(error.message));  // previously here we had setLoading(false); setError(error.message);
  }
  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 ">
        <input type="email" placeholder='email' className='border p-3 rounded-lg bg-white' id='email'onChange={handleChange}/>
        <input type="password" placeholder='password' className='border p-3 rounded-lg bg-white' id='password'onChange={handleChange}/>
        <button disabled={loading} className='border bg-slate-700 text-white rounded-lg uppercase p-3 hover:opacity-95 disabled:opacity-80'>{loading ? 'Loading':'Sign In'}</button>
      </form>
      <div className='flex gap-2 mt-4 p-0.5'>
        <p>Dont have an account?</p>
        <Link to={"/sign-up"}>
        <span className='text-blue-700'>Sign up</span>
        </Link>
      </div>
      {error && <p className='text-red-600 mt-5'>{error}</p>}
    </div>
  )
}
