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
    <main style={{
      backgroundImage: `url("${'/bg2.svg'}")`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover'
    }}  className="bg-white dark:bg-slate-900">

      <div className="relative md:flex items-center justify-center">

        {/* Content */}
        <div className="md:w-1/2">
          <div className="min-h-[100dvh] h-full  flex  flex-col after:flex-1">

            {/* <AuthHeader /> */}

            <div 
              style={{
                background: 'linear-gradient(180deg, rgb(253, 70, 119) 0%, rgb(137, 82, 222) 100%)'
              }}
              className="max-w-sm rounded-2xl h-full  mt-28 mx-auto w-full px-4 py-8"
            > 
              <h1 className="text-3xl text-slate-100 font-bold mb-6">LOGIN</h1>
              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div  className="space-y-4">
                  <div>
                    <label className="block text-slate-100 text-sm font-medium mb-1" htmlFor="email">Email Address</label>
                    <input  required id="company-email" value={email}  onChange={(e) => setEmail(e.target.value)} className={`form-input rounded-xl py-2 pl-2 w-full `} type="email" placeholder=' Email Address' />
                  </div>
                  <div>
                  <div>
                    <label className="block text-slate-100 text-sm font-medium mb-1" htmlFor="password">Password</label>
                    <div className="relative">
                    <input id="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="form-input rounded-xl py-2 pl-2 w-full"  type={showPassword ? "text" : "password"} placeholder='password' autoComplete="on" />
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
                    <Link className="text-sm text-slate-100 underline hover:no-underline" href="/reset-password">Forgot Password?</Link>
                  </div>
                  <button
                      type="submit"
                      className="btn bg-indigo-600 px-3 py-2 rounded-xl  hover:bg-indigo-700 text-white ml-3 whitespace-nowrap"
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
                <div className="text-sm text-slate-100">
                  Don&apos;t you have an account? <Link className="font-medium text-indigo-700 hover:text-indigo-800 dark:hover:text-indigo-400" href="/signup">Sign Up</Link>
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