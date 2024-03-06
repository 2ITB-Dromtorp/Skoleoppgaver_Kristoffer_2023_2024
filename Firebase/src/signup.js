import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getAuth } from 'firebase/auth';

export function Signup() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    //const [confirmPassword, setConfirmPassword] = useState('');

    const auth = getAuth();

    const onSubmit = async (e) => {
        e.preventDefault()

        await createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                console.log("signed in")
                const user = userCredential.user;
                console.log(user);
                navigate("/login")
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                // ..
            });


    }

    return (
        <div className='flex flex-col bg-gray-900 h-screen w-screen items-center justify-center px-6 py-8 mx-auto lg:py-0'>
            <div className='w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-gray-800 border-gray-700'>
                <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
                    <h1 class="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">
                        Create Account
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
                        <div>
                            <label htmlFor="Confirm Password" className='block mb-2 text-sm font-medium text-white'>
                                Confirm Password
                            </label>
                            <input
                                id="Confirm Password"
                                name="Confirm Password"
                                type="Confirm Password"
                                className='sm:text-sm rounded-lg  block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500'
                                required
                                placeholder="Confirm Password"
                            //onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        <button type="submit" onClick={onSubmit} class="w-full text-white  focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-800">Sign up</button>
                        <p class="text-sm font-light text-gray-400">
                            <NavLink to="/">
                                Already have account? <a href="#" class="font-medium hover:underline text-primary-500">Log in</a>
                            </NavLink>
                        </p>
                    </form>
                </div>

            </div>

        </div>
    )
}

export default Signup