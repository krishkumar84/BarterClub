'use client'

import { useEffect, useState } from 'react'
import { Skeleton } from './ui/skeleton'
import Link from 'next/link'
import { cn, formatPrice } from '@/lib/utils'
import ImageSlider from './ImageSlider'
import { IProduct } from '@/lib/models/product.model'

interface ProductListingProps {
  product: IProduct | null
  index: number
}

const ProductListing = ({
  index,product
}: ProductListingProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false)
   console.log("aagya yha tk bhi")
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, index * 75)

    return () => clearTimeout(timer)
  }, [index])

  // Static product details
  // const staticProduct = {
  //   id: '1',
  //   name: 'Static Product Name',
  //   price: 19.99,
  //   category: 'electronics',
  //   images: [
  //     'https://images.pexels.com/photos/206959/pexels-photo-206959.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  //     'https://images.pexels.com/photos/70746/strawberries-red-fruit-royalty-free-70746.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  //     'https://images.pexels.com/photos/327098/pexels-photo-327098.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  //   ]
  // }
  if (!product) return <ProductPlaceholder />

  if (!isVisible) return <ProductPlaceholder />

  return (
    <Link
      className={cn(
        'invisible h-full w-full cursor-pointer group/main',
        {
          'visible animate-in fade-in-5': isVisible,
        }
      )}
      href={`/product/${product._id}`}>
      <div className='flex flex-col w-full'>
      <ImageSlider urls={product.images || []} />

        <h3 className='mt-4 font-medium text-sm text-gray-700'>
        {product.title}
        </h3>
        <p className='mt-1 text-sm text-gray-500'>
        {product.category.name}
        </p>
        <p className='mt-1 font-medium text-sm text-gray-900'>
        ₹{product.price}
        </p>
      </div>
    </Link>
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
