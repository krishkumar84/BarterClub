'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { useUser } from "@clerk/nextjs"
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { toast } from "sonner"

interface Product {
  _id: string
  title: string
  price: number
  // Add other product properties as needed
}

const AddToCartButton = ({ product }: { product: Product }) => {
  const { isSignedIn } = useUser()
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = () => {
    if (!isSignedIn) {
      router.push('/signin')
    } else {
      setIsModalOpen(true)
    }
  }

  const handleBuy = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/createOrder', {
        method: 'POST',
        body: JSON.stringify({
          productId: product._id
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (res.status === 201) {
        toast.success("Order placed successfully!")
        setIsModalOpen(false)
      } else {
        const data = await res.json()
        toast.error(data.message)
        if(data.message === 'Insufficient points for the transaction') {
          router.push('/profile#buy-points')
        }
      }
    } catch (error:any) {
      console.error(error)
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button
        onClick={handleClick}
        size='lg'
        className='w-full'
      >
        Buy Product
      </Button>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Purchase</DialogTitle>
            <DialogDescription>
              Are you sure you want to buy {product.title} for {product.price} Barter Points?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleBuy} disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Confirm Purchase'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AddToCartButton