'use client'
import Link from 'next/link';
import { useState } from 'react';
// import AuthHeader from '../auth-header';
// import AuthImage from '../auth-image';
import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [email, setEmail] = useState('');


  const handleSignUp = async (e: any) => {
    e.preventDefault();

    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        username:username,
        emailAddress: email,
        password,
        firstName: fullName.split(' ')[0],
        lastName: fullName.split(' ')[1],
        
      });

      // send the email.
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      // change the UI to our pending section.
      setPendingVerification(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleVerification = async (e: any) => {
    e.preventDefault();
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (completeSignUp.status !== 'complete') {
        console.log(JSON.stringify(completeSignUp, null, 2));
      }
      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push('/');
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <main className="bg-white dark:bg-slate-900">
      <div className="relative md:flex items-center justify-center">
        {/* Content */}
        <div className="w-full">
          <div className="min-h-[100dvh] h-full flex flex-col after:flex-1">
            {/* <AuthHeader /> */}

            <div className="max-w-sm mx-auto w-full px-4 py-8">
              <h1 className="text-3xl text-slate-800 dark:text-slate-100 font-bold mb-6">
                Create your Account ✨
              </h1>
              {/* Form */}
              {!pendingVerification ? (
                <form onSubmit={handleSignUp}>
                  <div className="space-y-4">
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="username"
                      >
                        Username <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="username"
                        className="form-input w-full"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        required
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="email"
                      >
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                       required
                       id="email"
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       className={`form-input w-full`}
                       type="email"
                       placeholder='Company Email Address'
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="fullName"
                      >
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="fullName"
                        className="form-input w-full"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Full Name"
                        required
                      />
                    </div>
                    <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
                    <div className="relative">
                    <input id="password" placeholder='password' value={password} onChange={(e)=>setPassword(e.target.value)} className="form-input w-full"  type={showPassword ? "text" : "password"} autoComplete="on" />
                    <button  type="button"  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5" onClick={() => setShowPassword(!showPassword)}
                     >
                     {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  </div>
                  </div>
                  {errorMessage && (
                    <div className="mt-4 text-red-600">
                      {errorMessage}
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-6">
                    <div className="mr-1">
                      <label className="flex items-center">
                        <input type="checkbox" className="form-checkbox" />
                        <span className="text-sm ml-2">
                          Email me about product news.
                        </span>
                      </label>
                    </div>
                    <button
                      type="submit"
                      className="btn bg-indigo-500 p-3 rounded-xl  hover:bg-indigo-600 text-white ml-3 whitespace-nowrap"
                    >
                      Sign Up
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleVerification}>
                  <div className="space-y-4">
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="otp"
                      >
                        Enter OTP <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="otp"
                        className="form-input w-full"
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="OTP"
                        required
                      />
                    </div>
                  </div>
                  {errorMessage && (
                    <div className="mt-4 text-red-600">
                      {errorMessage}
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-6">
                    <button
                      type="submit"
                      className="btn bg-indigo-500 hover:bg-indigo-600 text-white ml-3 whitespace-nowrap"
                    >
                      Verify OTP
                    </button>
                  </div>
                </form>
              )}
              {/* Footer */}
              <div className="pt-5 mt-6 border-t border-slate-200 dark:border-slate-700">
                <div className="text-sm">
                  Have an account?{' '}
                  <Link
                    className="font-medium text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                    href="/signin"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <AuthImage /> */}
      </div>
    </main>
  );
}