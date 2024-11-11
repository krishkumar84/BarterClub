import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import ProductReel from '@/components/ProductReel'
import { SearchParamProps } from '@/types'
import { auth } from "@clerk/nextjs/server";
import Link from 'next/link'
import React from 'react'
import axios from 'axios';
import { config } from '@/constants/index'
import UserBalance from '@/components/UserBalance';
import TransactionHistory from '@/components/TransactionHistory';
import MyOrders from '@/components/myOrder';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import BuyPoints from '@/components/buy-points';
import {
  SignedIn,
  SignedOut,
  SignOutButton,
  UserButton,
} from "@clerk/nextjs";

interface User {
  _id: string;
  clerkId: string;
  Name: string;
  email: string;
  phone: string;
  Gst: string;
  Address: string;
  subscription: {
    isActive: boolean;
    plan: string;
    endDate: string;
  };
  balance: number;
  discountPoints: number;
  purchasedPoints: number;
  transactionHistory: {
    _id: string;
    date: string;
    amount: number;
    transactionType: string;
    points: number;
    description?: string;
  }[];
}


const apiUrl = config.apiUrl;
const ProfilePage = async ({ searchParams }: SearchParamProps) => {
  const { sessionClaims } = auth();
  const userId = (sessionClaims?.userId as any)?.userId;

  const { userId:clerkId } : { userId: string | null } = auth();

  if (!clerkId) return null;
const getRelatedPostByUser = await axios.get(`${apiUrl}/api/getRelatedPostByUser?userId=${userId}`);
const data = getRelatedPostByUser.data;
console.log(data);

const chkstatus = await axios.get(`${apiUrl}/api/checkSubscriptionStatus?userId=${userId}`);
console.log(chkstatus.data);

const getholdPayment = await axios.get(`${apiUrl}/api/esCrowPaymentByUser?userId=${userId}`);
console.log(getholdPayment.data,"hell ya");

const res = await axios.get(`${apiUrl}/api/getclientuserdetail/${userId}`);
const user: User = res.data.data;

const BREADCRUMBS = [
  { id: 1, name: 'Home', href: '/' },
  { id: 2, name: 'Products', href: '/products' },
]

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
      <div className="flex items-center justify-between mx-12 mt-8">
        {/* Left - Breadcrumbs */}
        <ol className="flex items-center space-x-2">
          {BREADCRUMBS.map((breadcrumb, i) => (
            <li key={breadcrumb.href}>
              <div className="flex items-center text-sm">
                <Link href={breadcrumb.href} className="font-medium text-sm text-muted-foreground hover:text-gray-900">
                  {breadcrumb.name}
                </Link>
                {i !== BREADCRUMBS.length - 1 ? (
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    className="ml-2 h-5 w-5 flex-shrink-0 text-gray-300">
                    <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                  </svg>
                ) : null}
              </div>
            </li>
          ))}
        </ol>

        {/* Right - Buttons */}
        <div className="flex items-center space-x-4">
          <SignedIn>
            <SignOutButton>
              <Link href="/">
                <button
                  type="button"
                  className="rounded-3xl px-6 py-3 text-sm font-semibold text-[#FD4677] shadow-sm hover:bg-slate-300 hover:text-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">
                  Logout
                </button>
              </Link>
            </SignOutButton>
            <UserButton />
          </SignedIn>
        </div>
      </div>

        <div className="wrapper p-6 pl-20 flex items-center justify-center sm:justify-between">
        <h1 className='text-2xl font-bold text-gray-900 sm:text-3xl'>
        My Orders
            </h1>
          <Button asChild size="lg" className="button hidden sm:flex">
            <Link href="/products">
              Explore More Products
            </Link>
          </Button>
        </div>
      </section>
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/placeholder-user.jpg" alt={"user img"} />
              <AvatarFallback>{user.Name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user.Name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Phone</Label>
              <p>{user.phone}</p>
            </div>
            <div>
              <Label>GST</Label>
              <p>{user.Gst}</p>
            </div>
            <div>
              <Label>Address</Label>
              <p>{user.Address}</p>
            </div>
            <div>
              <Label>Subscription Status</Label>
              <Badge variant={user.subscription.isActive ? "success" : "destructive"}>
                {user.subscription.isActive ? "Active" : "Inactive"}
              </Badge>
              <p className="text-sm text-muted-foreground">{user.subscription.plan} Plan</p>
              <p className="text-sm text-muted-foreground">ends on: {new Date(user.subscription.endDate).toLocaleDateString()}</p>
            </div>
           <div>
              <Label>Points Hold in BarterClub</Label>
              <p className="text-sm text-muted-foreground">points will be added after delivery of product and confirmation by buyer</p>
              <p>{getholdPayment.data} Points</p>
          </div>
          {!user.subscription.isActive && (
             <Link href="/#pricing">
               <button className="btn px-2 py-2 rounded-md btn-primary mt-2 bg-black text-white">
                 Upgrade Subscription
               </button>
             </Link>
           )}
          </div>
        </CardContent>
      </Card>
       <UserBalance />
       <TransactionHistory/>
       <BuyPoints/>
       <MyOrders userId={userId}/>
      <section className="wrapper my-8">
      <MaxWidthWrapper>
      <ProductReel
          data={data?.data}
          emptyTitle="No Posts have been created yet"
          emptyStateSubtext="Go create some now"
          collectionType="My Products"
          limit={3}
          page={1}
          hide={false}
          urlParamName="eventsPage"
          totalPages={2}
          />
    </MaxWidthWrapper>
      </section>
    </>
  )
}

export default ProfilePage