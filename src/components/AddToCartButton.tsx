'use client'

import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { useUser } from "@clerk/nextjs";
import { useRouter } from 'next/navigation'
// import { useAuth } from '@clerk/nextjs';
// import { useCart } from '@/hooks/use-cart'
// import { Product } from '@/payload-types'

const AddToCartButton = ({
  product,
}: {
  product: any
}) => {
//   const { addItem } = useCart()
const { isSignedIn } = useUser(); 
  const router = useRouter()
  // const { userId } = useAuth();
  const [isSuccess, setIsSuccess] = useState<boolean>(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsSuccess(false)
    }, 2000)

    return () => clearTimeout(timeout)
  }, [isSuccess])

  const handleclick = () => {
    if(!isSignedIn){
      router.push('/signin')
    }else{
      setIsSuccess(true)
    }
  }

  const handleBuy = async() => {
    const res = await fetch('/api/createOrder', {
      method: 'POST',
      body: JSON.stringify({
        //  buyerId: product.userId,
        productId: product._id
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    console.log(res);
    console.log("product",product);
    console.log(product._id);
    console.log(product.userId);

    if (res.ok) {
      setIsSuccess(true)
    }
  }

  return (
    <Button
      onClick={() => {
        handleclick();
        handleBuy();
        // addItem(product)
        // setIsSuccess(true)
      }}
      size='lg'
      className='w-full'>
      {isSuccess ? 'Buying!' : 'Buy Product'}
    </Button>
  )
}

export default AddToCartButton