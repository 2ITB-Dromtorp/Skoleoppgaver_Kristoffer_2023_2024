import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { NavLink, useNavigate } from 'react-router-dom'
import { getAuth } from 'firebase/auth';

export function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const auth = getAuth();

    const onLogin = async (e) => {
        e.preventDefault();
        console.log("pressed submit")


        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                console.log("user logged inn")
                const user = userCredential.user;
                console.log(user);
                navigate("/home")

            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage)
            });

    }

    return (
        <div className='flex flex-col bg-gray-900 h-screen w-screen items-center justify-center px-6 py-8 mx-auto lg:py-0'>
            <div className='w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-gray-800 border-gray-700'>
                <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
                    <h1 class="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">
                        Log in to your account
                    </h1>
                    <form className='space-y-4 md:space-y-6'>
                        <label htmlFor="email-address" className='block mb-2 text-sm font-medium text-white'>
                            Email address
                        </label>
                        <input
                            id="email-address"
                            name="email"
                            className='sm:text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500'
                            type="email"
                            required
                            placeholder="Email address"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <div>
                            <label htmlFor="password" className='block mb-2 text-sm font-medium text-white'>
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                className='sm:text-sm rounded-lg  block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500'
                                required
                                placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>


                        <div class="flex items-center justify-between">
                            <div class="flex items-start">
                                <div class="flex items-center h-5">
                                    <input id="remember" aria-describedby="remember" type="checkbox" class="w-4 h-4 border  focus:ring-3  bg-gray-700 border-gray-600 focus:ring-primary-600 ring-offset-gray-800" required=""></input>
                                </div>
                                <div class="ml-3 text-sm">
                                    <label for="remember" class="text-gray-300">Remember me</label>
                                </div>
                            </div>
                            <a href="#" class="text-sm font-medium hover:underline text-primary-500">Forgot password?</a>
                        </div>

                        <button type="submit" onClick={onLogin} class="w-full text-white  focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-800">Log in</button>
                        <p class="text-sm font-light text-gray-400">
                            <NavLink to="/signup">
                                Don't have an account yet? <a href="#" class="font-medium hover:underline text-primary-500">Sign up</a>
                            </NavLink>
                        </p>
                    </form>
                </div>

            </div>

        </div>
    )
}

export default Login