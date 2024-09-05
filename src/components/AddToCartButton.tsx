'use client'

import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { useUser } from "@clerk/nextjs";
import { useRouter } from 'next/navigation'
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

  return (
    <Button
      onClick={() => {
        handleclick()
        // addItem(product)
        // setIsSuccess(true)
      }}
      size='lg'
      className='w-full'>
      {isSuccess ? 'Added!' : 'Add to cart'}
    </Button>
  )
}

export default AddToCartButton