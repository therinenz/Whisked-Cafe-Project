import React, { useState } from 'react';
import { User2, Lock, Eye, EyeOff } from 'lucide-react'; // Import Eye and EyeOff icons
import google from '../assets/Google.png'
import logo from '../assets/Logo.png'

const Login = () => {
      // State for handling password visibility
      const [password, setPassword] = useState('');
      const [isPasswordVisible, setIsPasswordVisible] = useState(false);

        const handlePasswordChange = (event) => {
         setPassword(event.target.value);
         };

      const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
        };

  return (
    <section className="bg-gray-50">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-2 md:space-y-6 sm:p-8">
            <div className='flex items-center justify-center mr-12'>
              <img src={logo} alt="logo" className="w-12 mr-3" />
              <span className="text-2xl font-bold leading-tight tracking-tight text-primary dark:text-white">Welcome!</span>
            </div>

            <h1 className="text-lg font-bold leading-tight tracking-tight text-primary dark:text-white">
              Log in
            </h1>
            <form className="space-y-10 md:space-y-8">

              {/* Email section */}
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Email
                </label>
                <div className="relative">
                  <User2 className="absolute text-mediumGray left-3 mt-3.5" />
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg pl-12 focus:ring-primary-600 block w-full p-4 focus:border-hover focus:ring-inset focus:ring-hover dark:bg-hover outline-none"
                    placeholder="Enter email"
                    required
                  />
                </div>
              </div>

              {/* Password section */}
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute text-mediumGray left-3 mt-3.5" />
                  <input
                    type={isPasswordVisible ? "text" : "password"} // Toggle input type
                    name="password"
                    id="password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Enter password"
                    className="bg-gray-50 pl-12 border border-gray-300 text-black text-sm rounded-lg block w-full p-4 dark:text-white focus:border-hover focus:ring-inset focus:ring-hover dark:bg-hover dark:border-hover outline-none"
                    required
                  />
                  {/* Eye icon */}
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-3"
                  >
                    {isPasswordVisible ? <Eye className="text-mediumGray" /> : <EyeOff className="text-mediumGray" />}
                  </button>
                </div>
              </div>

              {/* Button */}
              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
