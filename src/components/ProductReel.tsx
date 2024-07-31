'use client'
import Link from 'next/link'
import ProductListing from './ProductListing'
import { useEffect, useState } from 'react'
import { IProduct } from '@/lib/models/product.model'

interface Product {
    id: string
    name: string
    price: number
    }

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
  // const { title, subtitle, href } = props

  // Dummy data for initial display
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    // Simulate a data fetch with a timeout
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        // Replace this with your actual API call
        const response = await new Promise<Product[]>((resolve) => {
          setTimeout(() => {
            resolve([
              { id: '1', name: 'Product 1', price: 100 },
              { id: '2', name: 'Product 2', price: 200 },
              { id: '3', name: 'Product 3', price: 300 },
              { id: '4', name: 'Product 4', price: 400 },
            ])
          }, 1000)
        })
        setProducts(response)
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  let map: (Product | null)[] = []
  if (products && products.length) {
    map = products
  } else if (isLoading) {
    map = new Array<null>(
       FALLBACK_LIMIT
    ).fill(null)
  }

  return (
    <section className='py-12'>
      <div className='md:flex md:items-center md:justify-between mb-4'>
        {/* <div className='max-w-2xl px-4 lg:max-w-4xl lg:px-0'>
          {title ? (
            <h1 className='text-2xl font-bold text-gray-900 sm:text-3xl'>
              {title}
            </h1>
          ) : null}
          {subtitle ? (
            <p className='mt-2 text-sm text-muted-foreground'>
              {subtitle}
            </p>
          ) : null}
        </div> */}

        {/* {href ? (
          <Link
            href={href}
            className='hidden text-sm font-medium text-blue-600 hover:text-blue-500 md:block'>
            Shop the collection{' '}
            <span aria-hidden='true'>&rarr;</span>
          </Link>
        ) : null} */}
      </div>

      <div className='relative'>
        <div className='mt-6 flex items-center w-full'>
          <div className='w-full grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-10 lg:gap-x-8'>
            {map.map((product, i) => (
              <ProductListing
                key={`product-${i}`}
                //  product={product}
                index={i}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductReel