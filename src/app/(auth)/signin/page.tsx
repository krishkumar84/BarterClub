'use client'

import { useState } from 'react'
import * as React from 'react'
import { useSignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner";

export default function SignIn() {
  const { isLoaded, signIn, setActive } = useSignIn()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isLoaded || isLoading) {
      return
    }

    setIsLoading(true)

    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      })

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.push('/profile')
      } else {
        toast.error("An error occurred during sign in.")
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err: any) {
      if (err.errors && Array.isArray(err.errors)) {
        err.errors.forEach((error: any) => {
          toast.error(error.message)
        })
      } else {
        toast.error("An error occurred during sign in.")
      }
      console.error(JSON.stringify(err, null, 2))
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
                  <CardTitle className="text-3xl font-bold">LOGIN</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
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
                    <div className="flex items-center justify-between">
                      <Link className="text-sm underline hover:no-underline" href="/reset-password">
                        Forgot Password?
                      </Link>
                      <Button 
                        type="submit" 
                        className="bg-white text-[#FD4677] hover:bg-white/90"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing In...
                          </>
                        ) : (
                          'Sign In'
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex flex-col items-start border-t border-white/20 space-y-2">
                  <div className="text-sm">
                    Don't have an account?{' '}
                    <Link className="font-medium text-indigo-200 hover:text-indigo-100" href="/signup">
                      Sign Up
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