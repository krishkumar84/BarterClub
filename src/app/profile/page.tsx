import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import ProductReel from '@/components/ProductReel'
import { Button } from '@/components/ui/button'
// import { getEventsByUser } from '@/lib/actions/event.actions'
// import { getOrdersByUser } from '@/lib/actions/order.actions'
// import { IOrder } from '@/lib/database/models/order.model'
import { SearchParamProps } from '@/types'
import { auth } from "@clerk/nextjs/server";
import Link from 'next/link'
import React from 'react'
import axios from 'axios';
import { config } from '@/constants/index'


const apiUrl = config.apiUrl;
const ProfilePage = async ({ searchParams }: SearchParamProps) => {
  const { sessionClaims } = auth();
  const userId = (sessionClaims?.userId as any)?.userId;

  const { userId:clerkId } : { userId: string | null } = auth();

  if (!clerkId) return null;
//   const ordersPage = Number(searchParams?.ordersPage) || 1;
//   const eventsPage = Number(searchParams?.eventsPage) || 1;

//   const orders = await getOrdersByUser({ userId, page: ordersPage})

//   const orderedEvents = orders?.data.map((order: IOrder) => order.event) || [];
//   const organizedEvents = await getEventsByUser({ userId, page: eventsPage })
console.log(userId);
console.log(`${apiUrl}/api/getRelatedPostByUser?userId=${userId}`);
const getRelatedPostByUser = await axios.get(`${apiUrl}/api/getRelatedPostByUser?userId=${userId}`);
const data = getRelatedPostByUser.data;
console.log(data);

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className='h3-bold text-center sm:text-left'>My Orders</h3>
          <Button asChild size="lg" className="button hidden sm:flex">
            <Link href="/#product">
              Explore More Products
            </Link>
          </Button>
        </div>
      </section>

      {/* <section className="wrapper my-8">
         <MaxWidthWrapper>
           <ProductReel
          data={orderedEvents}
          emptyTitle="No event tickets purchased yet"
          emptyStateSubtext="No worries - plenty of exciting events to explore!"
          collectionType="My_Tickets"
          limit={3}
          page={ordersPage}
          urlParamName="ordersPage"
          totalPages={orders?.totalPages}
        />
    </MaxWidthWrapper>
      </section> */}

      {/* Events Organized */}
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className='h3-bold text-center sm:text-left'>My Posts</h3>
          <Button asChild size="lg" className="button hidden sm:flex">
            <Link href="/addProduct">
              Create New Post
            </Link>
          </Button>
        </div>
      </section>

      <section className="wrapper my-8">
      <MaxWidthWrapper>
      <ProductReel
          data={data?.data}
          emptyTitle="No Posts have been created yet"
          emptyStateSubtext="Go create some now"
          collectionType="My_Post"
          limit={3}
          page={1}
          hide={true}
          urlParamName="eventsPage"
          totalPages={2}
          />
    </MaxWidthWrapper>
      </section>
    </>
  )
}

export default ProfilePage