"use client"

import Link from 'next/link'
import React, { useState } from 'react'
import { useAuth, useSignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function ResetPassword() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [successfulCreation, setSuccessfulCreation] = useState(false)
  const [secondFactor, setSecondFactor] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const router = useRouter()
  const { isSignedIn } = useAuth()
  const { isLoaded, signIn, setActive } = useSignIn()

  if (!isLoaded) {
    return null
  }

  if (isSignedIn) {
    router.push('/')
    return null
  }

  async function create(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    try {
      await signIn?.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      })
      setSuccessfulCreation(true)
      toast.success("Reset code sent to your email.")
    } catch (err: any) {
      console.error('error', err.errors[0].longMessage)
      toast.error(err.errors[0].longMessage)
    } finally {
      setIsLoading(false)
    }
  }

  async function reset(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    try {
      const result = await signIn?.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password,
      })
      if (result?.status === 'needs_second_factor') {
        setSecondFactor(true)
        toast.info("2FA is required. Please check your authenticator app.")
      } else if (result?.status === 'complete') {
        setActive && setActive({ session: result.createdSessionId })
        toast.success("Password reset successfully.")
        router.push('/')
      } else {
        console.log(result)
      }
    } catch (err: any) {
      console.error('error', err.errors[0].longMessage)
      toast.error(err.errors[0].longMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-white dark:bg-slate-900 bg-[url('/bg2.svg')] bg-no-repeat bg-cover">
      <div className="relative md:flex items-center justify-center">
        <div className="md:w-1/2">
          <div className="min-h-[100dvh] h-full flex flex-col after:flex-1">
            <Card className="max-w-sm mx-auto w-full mt-28 bg-gradient-to-b from-[#FD4677] to-[#8952DE] text-white">
              <CardHeader>
                <CardTitle className="text-3xl font-bold">
                  Reset your Password
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={!successfulCreation ? create : reset} className="space-y-4">
                  {!successfulCreation ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-white text-[#FD4677] hover:bg-white/90"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          'Send Reset Link'
                        )}
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="password">New Password</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute inset-y-0 right-0 pr-3 hover:bg-[#FD4677] text-white/50 hover:text-white"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            <span className="sr-only">Toggle password visibility</span>
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="code">Reset Code</Label>
                        <Input
                          id="code"
                          type="text"
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          required
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-white text-[#FD4677] hover:bg-white/90"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Resetting...
                          </>
                        ) : (
                          'Reset Password'
                        )}
                      </Button>
                    </>
                  )}
                </form>
                {secondFactor && (
                  <p className="mt-4 text-center">2FA is required. Please check your authenticator app.</p>
                )}
              </CardContent>
              <CardFooter className="flex flex-col items-start border-t border-white/20 space-y-2">
                <div className="text-sm">
                  Remember your password?{' '}
                  <Link className="font-medium text-indigo-200 hover:text-indigo-100" href="/signin">
                    Sign In
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}