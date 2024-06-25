'use client';
import { useState } from 'react';
import * as React from 'react';
import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link'
// import AuthHeader from '../auth-header'
// import AuthImage from '../auth-image'
// import Toast02 from '../../../components/toast-02';

export default function SignIn() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const [companyEmail, setCompanyEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);

  const validateEmail = (email:string) => {
    const commonDomains = ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com'];
    const emailDomain = email.split('@')[1];
    if (emailDomain) {
      return !commonDomains.includes(emailDomain);
    }
    return true;
  };

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const email = (e.target as HTMLInputElement).value;
    setCompanyEmail(email);
    setIsValidEmail(validateEmail(email));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded) {
      return;
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: companyEmail,
        password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        router.push('/');
      } else {
        setErrorMessage('Invalid email or password');
      setToastOpen(true);
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
      let errorMsg = 'Invalid email or password'; 
      if (err && err.errors && Array.isArray(err.errors) && err.errors.length > 0) {
        errorMsg = err.errors[0].message || errorMsg;
      }

      setErrorMessage(errorMsg)
      setToastOpen(true);
      console.error(JSON.stringify(err, null, 2));
    }
  };
  return (
    <main className="bg-white dark:bg-slate-900">

      <div className="relative md:flex">

        {/* Content */}
        <div className="md:w-1/2">
          <div className="min-h-[100dvh] h-full flex flex-col after:flex-1">

            {/* <AuthHeader /> */}

            <div className="max-w-sm mx-auto w-full px-4 py-8">
              <h1 className="text-3xl text-slate-800 dark:text-slate-100 font-bold mb-6">Welcome back! ✨</h1>
              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="email">Email Address</label>
                    <input  required id="company-email" value={companyEmail} onChange={handleChange} className={`form-input w-full ${isValidEmail ? '' : 'border-red-500'}`} type="email" placeholder='Company Email Address' />
                    {!isValidEmail && (
                          <p className="text-red-500 text-sm mt-1">Please enter a valid company email address.</p>
                        )}
                  </div>
                  <div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
                    <div className="relative">
                    <input id="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="form-input w-full"  type={showPassword ? "text" : "password"} placeholder='password' autoComplete="on" />
                    <button  type="button"  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5" onClick={() => setShowPassword(!showPassword)}
                     >
                     {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-6">
                  <div className="mr-1">
                    <Link className="text-sm underline hover:no-underline" href="/reset-password">Forgot Password?</Link>
                  </div>
                  <button
                      type="submit"
                      className="btn bg-indigo-500 hover:bg-indigo-600 text-white ml-3 whitespace-nowrap"
                    >
                      Sign In
                    </button>
                </div>
                <div className="pt-2">
              {/* <Toast02 type="error" open={toastOpen} setOpen={setToastOpen}> {errorMessage} </Toast02> */}
              </div>
              </form>
              {/* Footer */}
              <div className="pt-5 mt-6 border-t border-slate-200 dark:border-slate-700">
                {/* <div className="text-sm">
                  Don't you have an account? <Link className="font-medium text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400" href="/signup">Sign Up</Link>
                </div> */}
                {/* Warning */}
                <div className="mt-5">
                  <div className="bg-amber-100 dark:bg-amber-400/30 text-amber-600 dark:text-amber-400 px-3 py-2 rounded">
                    <svg className="inline w-3 h-3 shrink-0 fill-current mr-2" viewBox="0 0 12 12">
                      <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                    </svg>
                    <span className="text-sm">
                      To support you during the pandemic super pro features are free until March 31st.
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* <AuthImage /> */}

      </div>

    </main>
  )
}