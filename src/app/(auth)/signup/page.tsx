'use client'

import { useState } from 'react'
import * as React from 'react'
import { useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import axios from 'axios'

export default function SignUp() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [phone, setPhone] = useState('')
  const [gst, setGst] = useState('')
  const [plan, setPlan] = useState('Free')
  const [address, setAddress] = useState('')
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isLoaded || isLoading) {
      return
    }

    setIsLoading(true)

    try {
      console.log(`Phone number being sent: +91${phone}`);
      const phonechek =  await axios.post('/api/checkPhoneNo', { phone: `+91${phone}`})
      if(phonechek.data.status !== 200){
       toast.error(phonechek.data?.message || "An error occurred during sign up.")
       return 
      }
      await signUp.create({
        emailAddress: email,
        password,
        firstName: fullName.split(' ')[0],
        lastName: fullName.split(' ')[1],
        unsafeMetadata: {
          PhoneNumber: `+91${phone}`,
          gst: gst,
          address: address,
          plan: 'Free',
        },
      })
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      console.log(`Phone number being sent: +91${phone}`);
      setPendingVerification(true)
      toast.success("Verification email sent. Please check your inbox.")
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2))
      toast.error(err.errors?.[0]?.message || "An error occurred during sign up.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isLoaded || isLoading) {
      return
    }

    setIsLoading(true)

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      })
      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId })
        toast.success("Account created successfully!")
        await axios.get('/api/welcomeMail')
        router.push('/')
        if(plan != 'Free') {
          router.push('/#pricing');
        }
      } else {
        toast.error("Verification failed. Please try again.")
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2))
      toast.error(err.errors?.[0]?.message || "Verification failed. Please try again.")
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
                  {pendingVerification ? "Verify Email" : "Create Account"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!pendingVerification ? (
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
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
                    <div className="space-y-2">
                      <div className="flex">
                      <Label htmlFor="phone">Phone Number </Label>
                      <p className='text-gray-200 text-[12px]'>( without +91)</p>
                      </div>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gst">GST Number</Label>
                      <Input
                        id="gst"
                        value={gst}
                        onChange={(e) => setGst(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="plan">Plan</Label>
                      <Select onValueChange={setPlan} defaultValue={plan}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Select a plan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Free">Free</SelectItem>
                          <SelectItem value="Basic">Basic</SelectItem>
                          <SelectItem value="Premium">Premium</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
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
                    <Button 
                      type="submit" 
                      className="w-full bg-white text-[#FD4677] hover:bg-white/90"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing Up...
                        </>
                      ) : (
                        'Sign Up'
                      )}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleVerification} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="code">Verification Code</Label>
                      <Input
                        id="code"
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
                          Verifying...
                        </>
                      ) : (
                        'Verify Email'
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
              <CardFooter className="flex flex-col items-start border-t border-white/20 space-y-2">
                <div className="text-sm">
                  Already have an account?{' '}
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