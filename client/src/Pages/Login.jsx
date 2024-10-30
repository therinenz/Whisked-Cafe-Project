import React from 'react'
import { User2, Lock } from 'lucide-react'
import google from '../assets/Google.png'
import logo from '../assets/Logo.png'


const Login = () => {
  return (
    <section className="bg-gray-50">
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
              <div className="p-6 space-y-2 md:space-y-6 sm:p-8">

                <div className='flex items-center justify-center mr-12'>
                  <img src={logo} alt="logo" className="w-12 mr-3" />
                  <span className="text-2xl font-bold leading-tight tracking-tight text-primary dark:text-white">Welcome!</span>
                </div>

                <h1 className="text-lg font-bold leading-tight tracking-tight text-primary  dark:text-white">
                  Log in
                </h1>


                <form className="space-y-4 md:space-y-6" >
                {/* Email section*/}
                <div> 
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                   Email
                </label>
                <div className="relative">
                 <User2 className="absolute text-grayme left-3 mt-2" />
                      <input       
                      type="email"
                      name="email"
                      id="email"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg pl-10 focus:ring-primary-600 block w-full p-2.5 focus:border-hover focus:ring-inset focus:ring-hover dark:bg-hover outline-none"
                      placeholder="name@gmail.com"
                      required
                        />
                  </div>
                  </div>


                {/* Password section */}
                  <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Password
                  </label>
                  <div className='relative'>
                      <Lock className='absolute text-grayme left-3 mt-2'/>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Enter password"
                        className="bg-gray-50 pl-10 border border-gray-300 text-black text-sm rounded-lg block w-full p-2.5 dark:text-white focus:border-hover focus:ring-inset focus:ring-hover dark:bg-hover dark:border-hover outline-none"
                        required    
                        />
                  </div>
                  </div>
                 
                 {/* Remember me */}
                  <div className="flex items-center justify-between">
                  <div className="flex items-start">
                  <div className="flex items-center h-5">
                  <input
                        id="remember"
                        aria-describedby="remember"
                        type="checkbox"
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800 text-PrimFont"
                        required=""
                        />
                  </div>
                  <div className="ml-3 text-sm">
                  <label
                        htmlFor="remember"
                        className="text-gray-500 dark:text-gray-300"
                  >
                    Remember me
                  </label>
                </div>
              </div>

               {/* Forgot pass */}
                    <a
                    href="#"
                    className="text-sm font-medium text-blue-600 hover:underline text-PrimFont">
                    Forgot password?
                    </a>
                    </div>
    
              {/* Buttons */}
             <div>
            <button
             type="submit"
             className="flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
              Sign in
              </button>
            </div>


            <div className="flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
              </div>
    
            {/* Sign in with google */}
            <button className="flex items-center justify-center w-full mt-7 px--4 py-1.5 border border-gray-300 rounded-md bg-white text-gray-600 text-sm hover:bg-gray-100">
            <img
                src={google}
                alt="Google logo"
                className="w-4 h-4 mr-2"
                />
            <span>Sign in with Google</span>
              </button>


              </form>
              </div>
              </div>
          
          </div>
        </section>
  )
}

export default Login
