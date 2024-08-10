'use client'
import Link from 'next/link'
import ProductListing from './ProductListing'
import { useEffect, useState } from 'react'
import { IProduct } from '@/lib/models/product.model'
import { useAuth } from '@clerk/nextjs';


interface ProductReelProps {
  data: IProduct[],
  emptyTitle: string,
  emptyStateSubtext: string,
  limit: number,
  page: number | string,
  totalPages?: number,
  urlParamName?: string,
  collectionType?: 'My_Post' | 'All_Posts'
}
const FALLBACK_LIMIT = 4

const ProductReel = ({
  data,
  emptyTitle,
  emptyStateSubtext,
  page,
  totalPages = 0,
  collectionType,
  urlParamName,
}: ProductReelProps) => {
  // console.log(data)
  // console.log("hitted")
  // Dummy data for initial display
  const [products, setProducts] = useState<IProduct[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  useEffect(() => {
    setProducts(data)
    setIsLoading(false)
  }, [data])
  const href = "/products"

  const displayProducts = isLoading ? 
    new Array(FALLBACK_LIMIT).fill(null) : 
    (products.length ? products : new Array(FALLBACK_LIMIT).fill(null))

    const BREADCRUMBS = [
      { id: 1, name: 'Home', href: '/' },
      { id: 2, name: 'Products', href: '/products' },
    ]
    
    const { userId } = useAuth();

  return (
    <section className='py-12'>
      <ol className='flex items-center space-x-2'>
              {BREADCRUMBS.map((breadcrumb, i) => (
                <li key={breadcrumb.href}>
                  <div className='flex items-center text-sm'>
                    <Link
                      href={breadcrumb.href}
                      className='font-medium text-sm text-muted-foreground hover:text-gray-900'>
                      {breadcrumb.name}
                    </Link>
                    {i !== BREADCRUMBS.length - 1 ? (
                      <svg
                        viewBox='0 0 20 20'
                        fill='currentColor'
                        aria-hidden='true'
                        className='ml-2 h-5 w-5 flex-shrink-0 text-gray-300'>
                        <path d='M5.555 17.776l8-16 .894.448-8 16-.894-.448z' />
                      </svg>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
      <div className='md:flex md:items-center mt-4 md:justify-between mb-4'>
        <div className='max-w-2xl px-4 lg:max-w-4xl lg:px-0'>
          {collectionType ? (
            <h1 className='text-2xl font-bold text-gray-900 sm:text-3xl'>
              {collectionType}
            </h1>
          ) : null}
        </div>

        {href ? (
          <Link
            href={href}
            className='hidden text-sm font-medium text-blue-600 hover:text-blue-500 md:block'>
            Shop the collection{' '}
            <span aria-hidden='true'>&rarr;</span>
          </Link>
        ) : null}
      </div>

      <div className='relative'>
        <div className='mt-6 flex items-center w-full'>
          <div className='w-full grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-10 lg:gap-x-8'>
          {displayProducts.map((product, i) => (
              <ProductListing
                key={`product-${i}`}
                product={product || { _id: '', title: '', price: 0, images: [] }}
                index={i}
                ActiveUserId={userId}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductReel