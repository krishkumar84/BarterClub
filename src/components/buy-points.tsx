'use client'

import { useState,useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import axios from 'axios'
import { useUser } from '@clerk/nextjs';

// Assuming these types are defined elsewhere in your project
type User = {
  publicMetadata: {
    userId: string
  }
  fullName: string
  primaryEmailAddress: {
    emailAddress: string
  }
}

type BuyPointsProps = {
  currentUser: User | null
}

export default function BuyPoints() {
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { user, isLoaded } = useUser(); 
  const [currentUser, setCurrentUser] = useState<any>(null);


  useEffect(() => {
    if (isLoaded) {
      setCurrentUser(user || null); 
      console.log('UserContext: ', user);
    }
  }, [isLoaded, user]);

  const handleBuyPoints = async (amountInINR: number) => {
    setIsLoading(true)
    try {
      const response = await axios.post('/api/buy-points', {
        userId: currentUser?.publicMetadata.userId,
        amountInINR,
      });

      const { orderId, keyId } = response.data;

      const options = {
        key: keyId, // Public Razorpay key
        amount: amountInINR * 100, // Amount in paise
        currency: "INR",
        name: "Barter Club",
        description: "Buy Barter Points",
        order_id: orderId, // Order ID created by the server
        handler: async (response: any) => {
          // Payment is handled by the server via webhook
          alert('Payment successful! Points will be added shortly.');
        },
        prefill: {
          name: currentUser?.fullName,
          email: currentUser?.primaryEmailAddress.emailAddress,
        },
        theme: {
          color: "#FD4677",
        },
      };

      // @ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response: any) => {
        alert('Payment failed! Please try again.');
      });
      rzp.open();
    } catch (error: any) {
      console.error('Error buying points:', error);
      alert('An error occurred while trying to buy points');
    } finally {
      setIsLoading(false)
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const amountInINR = parseFloat(amount)
    if (isNaN(amountInINR) || amountInINR <= 0) {
      alert('Please enter a valid amount')
      return
    }
    handleBuyPoints(amountInINR)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Buy Barter Points</CardTitle>
        <CardDescription>Enter the amount of points you want to buy</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Amount (INR)
            </label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount in INR"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              step="1"
              required
            />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          type="submit" 
          className="w-full" 
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Buy Points'}
        </Button>
      </CardFooter>
    </Card>
  )
}