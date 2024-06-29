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
  const [email, setEmail] = useState('');


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded) {
      return;
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: email,
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

      <div className="relative md:flex items-center justify-center">

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
                    <input  required id="company-email" value={email}  onChange={(e) => setEmail(e.target.value)} className={`form-input w-full `} type="email" placeholder=' Email Address' />
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
                      className="btn bg-indigo-500 px-3 py-2 rounded-xl  hover:bg-indigo-600 text-white ml-3 whitespace-nowrap"
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
                <div className="text-sm">
                  Don&apos;t you have an account? <Link className="font-medium text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400" href="/signup">Sign Up</Link>
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