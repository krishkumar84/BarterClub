'use client'

import { useEffect, useState } from 'react'
import { Skeleton } from './ui/skeleton'
import Link from 'next/link'
import { cn, formatPrice } from '@/lib/utils'
import ImageSlider from './ImageSlider'
import { IProduct } from '@/lib/models/product.model'
import Image from 'next/image'
import { DeleteConfirmation } from './DeleteConfirmation'

interface ProductListingProps {
  product: IProduct | null
  index: number
  ActiveUserId: string | null | undefined
}

const ProductListing = ({
  index,product,ActiveUserId
}: ProductListingProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, index * 75)

    return () => clearTimeout(timer)
  }, [index])

 const isPostCreater = ActiveUserId === product?.clerkId;

  if (!product) return <ProductPlaceholder />

  if (!isVisible) return <ProductPlaceholder />

  return (
    <div className='flex flex-col w-full'>
    <Link
      className={cn(
        'invisible h-full w-full cursor-pointer group/main',
        {
          'visible animate-in fade-in-5': isVisible,
        }
      )}
      href={`/product/${product._id}`}>
      <ImageSlider urls={product.images || []} />

        <h3 className='mt-4 font-medium text-sm text-gray-700'>
        {product.title}
        </h3>
        <p className='mt-1 text-sm text-gray-500'>
        {product.category.name}
        </p>
        <div className="flex space-x-2">
          <Image src="/logo.png" alt="Barter Point" width={20} height={20} />    
        <p className='mt-1 font-medium text-sm text-gray-900'>
        {product.price}
        </p>
        </div>
    </Link>
        {isPostCreater && (
        <div className=" flex flex- gap-4 rounded-xl bg-white py-3 shadow-sm transition-all">
          <Link href={`/addProduct/${product._id }/update`}>
            <Image src="/edit.svg" alt="edit" width={20} height={20} />
           </Link>

          <DeleteConfirmation clerkId={ActiveUserId} postId={product._id as string} />

          <Link href={`/orders?postId=${product._id }`}>
          <p className='mt-1 right-0 text-sm text-blue-600'>
        Orders
        </p>
           </Link>
        </div>
        )}
      </div>
  )
}

const ProductPlaceholder = () => {
  return (
    <div className='flex flex-col w-full'>
      <div className='relative bg-zinc-100 aspect-square w-full overflow-hidden rounded-xl'>
        <Skeleton className='h-full w-full' />
      </div>
      <Skeleton className='mt-4 w-2/3 h-4 rounded-lg' />
      <Skeleton className='mt-2 w-16 h-4 rounded-lg' />
      <Skeleton className='mt-2 w-12 h-4 rounded-lg' />
    </div>
  )
}

export default ProductListing
