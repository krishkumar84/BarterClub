"use client"
import Link from 'next/link'
import React, { useState } from 'react';
import { useAuth, useSignIn } from '@clerk/nextjs';
import type { NextPage } from 'next';
import { useRouter } from 'next/navigation';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [secondFactor, setSecondFactor] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { isLoaded, signIn, setActive } = useSignIn();

  if (!isLoaded) {
    return null;
  }

  // If the user is already signed in,
  // redirect them to the home page
  if (isSignedIn) {
    router.push('/');
  }


  async function create(e: React.FormEvent) {
    e.preventDefault();
    await signIn
      ?.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      })
      .then(_ => {
        setSuccessfulCreation(true);
        setError('');
      })
      .catch(err => {
        console.error('error', err.errors[0].longMessage);
        setError(err.errors[0].longMessage);
      });
  }



  async function reset(e: React.FormEvent) {
    e.preventDefault();
    await signIn
      ?.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password,
      })
      .then(result => {
        // Check if 2FA is required
        if (result.status === 'needs_second_factor') {
          setSecondFactor(true);
          setError('');
        } else if (result.status === 'complete') {
          // Set the active session to 
          // the newly created session (user is now signed in)
          setActive({ session: result.createdSessionId });
          setError('');
        } else {
          console.log(result);
        }
      })
      .catch(err => {
        console.error('error', err.errors[0].longMessage)
        setError(err.errors[0].longMessage);
      });
  }

  return (
    <main className="bg-white dark:bg-slate-900">
      <div className="relative md:flex">
        {/* Content */}
        <div className="md:w-1/2">
          <div className="min-h-[100dvh] h-full flex flex-col after:flex-1">
            {/* <AuthHeader /> */}

            <div className="max-w-sm mx-auto w-full px-4 py-8">
              <h1 className="text-3xl text-slate-800 dark:text-slate-100 font-bold mb-6">
                Reset your Password ✨
              </h1>
              {/* Form */}
              <form onSubmit={!successfulCreation ? create : reset}>
                {!successfulCreation && (
                  <>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="email">Email Address <span className="text-rose-500">*</span></label>
                    <input value={email}
                      onChange={(e) => setEmail(e.target.value)} id="email" className="form-input w-full" type="email" />
                  </div>

                    <div className="flex justify-end mt-6">
                      <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white whitespace-nowrap">
                        Send Reset Link
                      </button>
                    </div>
                    {error && <p>{error}</p>}
                  </>
                )}

                {successfulCreation && (
                  <div className="space-y-4">
                    <label className="block text-sm font-medium mb-1" htmlFor="password">Enter your new password</label>
                    <input
                      type="password"
                      value={password}
                      className="form-input w-full"
                      onChange={(e) => setPassword(e.target.value)}
                    />

                    <label className="block text-sm font-medium mb-1" htmlFor="password">
                      Enter the password reset code that was sent to your email
                    </label>
                    <input
                      type="text"
                      value={code}
                      className="form-input w-full"
                      onChange={(e) => setCode(e.target.value)}
                    />

                    <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white  whitespace-nowrap">Reset</button>
                    {error && <p>{error}</p>}
                  </div>
                )}

                {secondFactor && (
                  <p>2FA is required, but this UI does not handle that</p>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* <AuthImage /> */}
      </div>
    </main>
  );
}