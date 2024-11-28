import AddToCartButton from '@/components/AddToCartButton'
import ImageSlider from '@/components/ImageSlider'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import ProductReel from '@/components/ProductReel'
import { Check, Shield } from 'lucide-react'
import Link from 'next/link'
import { config } from '@/constants/index'
import axios from 'axios'
import Image from 'next/image'
import {auth } from '@clerk/nextjs/server';


const apiUrl = config.apiUrl;
interface PageProps {
  params: {
    productId: string
  }
}

const BREADCRUMBS = [
  { id: 1, name: 'Home', href: '/' },
  { id: 2, name: 'Products', href: '/products' },
]
const Page = async ({ params }: PageProps) => {
  const { userId} : { userId: string | null } = auth();
  console.log(userId);
  const { productId } = params
  // console.log(params);
  // console.log(productId);
  console.log("Fetching:", `${apiUrl}/api/product/${productId}`);
  const response = await axios.get(`${apiUrl}/api/product/${productId}`);
  // console.log(response.data);
  const productDetails = response.data;
  // console.log(productDetails);

  const getRelatedPost = await axios.get(`${apiUrl}/api/getRelatedPosts?categoryId=${productDetails.category._id}&postId=${productId}`);
  const data = getRelatedPost.data.data;

  
  const isPostCreater = userId === productDetails?.clerkId;

  // console.log(data);

  return (
    <>
      <MaxWidthWrapper className="bg-white">
        <div className="bg-white">
          <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
            {/* Product Details */}
            <div className="lg:max-w-lg lg:self-end">
              <ol className="flex items-center space-x-2">
                {BREADCRUMBS.map((breadcrumb, i) => (
                  <li key={breadcrumb.href}>
                    <div className="flex items-center text-sm">
                      <Link
                        href={breadcrumb.href}
                        className="font-medium text-sm text-muted-foreground hover:text-gray-900"
                      >
                        {breadcrumb.name}
                      </Link>
                      {i !== BREADCRUMBS.length - 1 ? (
                        <svg
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                          className="ml-2 h-5 w-5 flex-shrink-0 text-gray-300"
                        >
                          <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                        </svg>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-4">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  {productDetails.title}
                </h1>
              </div>

              <section className="mt-4">
                <div className="flex items-center">
                  <div className="flex space-x-2">
                    <Image
                      src="/logo.png"
                      alt="Barter Point"
                      width={20}
                      height={20}
                    />
                    <p className="font-bold text-gray-900">
                      {productDetails.price}
                    </p>
                  </div>

                  <div className="ml-4 border-l text-muted-foreground border-gray-300 pl-4">
                    {productDetails.category.name}
                  </div>
                </div>
                <div className="text-muted-foreground border-gray-300 mt-2">
                  {productDetails.delivery} Delivery
                </div>

                <div className="mt-4 space-y-6">
                  <p className="text-base text-muted-foreground">
                    {productDetails.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center">
                  <Check
                    aria-hidden="true"
                    className="h-5 w-5 flex-shrink-0 text-green-500"
                  />
                  <p className="ml-2 text-sm text-muted-foreground">
                    Available Quantity: {productDetails.availableQty}
                  </p>
                </div>
                <div className="mt-2 flex items-center">
                  <Check
                    aria-hidden="true"
                    className="h-5 w-5 flex-shrink-0 text-green-500"
                  />
                  <p className="ml-2 text-sm text-muted-foreground">
                    {productDetails.condition} condition
                  </p>
                </div>
                <div className="flex mt-3 items-center">
                  <p className="font-sm text-gray-900">
                    {productDetails.gst}% Gst
                  </p>

                  <div className="ml-4 border-l text-muted-foreground border-gray-300 pl-4">
                    Type: {productDetails.type}
                  </div>
                </div>
                <div className="mt-4 space-y-6">
                  <p className="text-base text-muted-foreground">
                    Seller: {productDetails.owner.Name}
                  </p>
                </div>
              </section>
            </div>

            {/* Product images */}
            <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
              <div className="aspect-square rounded-lg">
                <ImageSlider urls={productDetails.images} />
              </div>
            </div>

            {/* add to cart part */}
            <div className="mt-6 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
              <div>
                {!isPostCreater && (
                  <div className="mt-10">
                    {productDetails.availableQty <= 0 && (
                      <div className="bg-red-100 border text-center border-red-400 text-red-700 px-4 py-3 rounded relative">
                        <strong className="font-bold">Out of Stock!</strong>
                      </div>
                    )}
                    {productDetails.availableQty > 0 && (
                      <AddToCartButton product={productDetails} />
                    )}
                  </div>
                )}
                <div className="mt-6 text-center">
                  <div className="group inline-flex text-sm text-medium">
                    <Shield
                      aria-hidden="true"
                      className="mr-2 h-5 w-5 flex-shrink-0 text-gray-400"
                    />
                    <span className="text-muted-foreground hover:text-gray-700">
                      Eligible for {productDetails.deliveryTime} day delivery
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
      <section className="wrapper my-8 flex flex-col gap-8 md:gap-12">
        <MaxWidthWrapper>
          <ProductReel
            data={data}
            emptyTitle="No Related Post Found"
            emptyStateSubtext="Come back later"
            collectionType="Related_Posts"
            limit={6}
            page={1}
            hide={false}
            totalPages={data.totalPages}
          />
        </MaxWidthWrapper>
      </section>
    </>
  );
}

export default Page
