'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from 'next/link'

type Order = {
  _id: string
  product: {
    _id: string
    title: string
    price: number
    images: string[]
    description: string
    condition: string
    type: string
    availableQty: number
    deliveryTime: number
    owner: {
      Name: string
      email: string
      phone: string
    }
  }
  status: string
  createdAt: string
  pointsExchanged: number
}

type OrdersResponse = {
  data: Order[]
  currentPage: number
  totalPages: number
  totalItems: number
}

export default function MyOrders(userId: any) {
    console.log(userId)
  const [orders, setOrders] = useState<Order[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  const fetchOrders = async (page: number) => {
    try {
      const response = await fetch(`/api/getOrderByUser?userId=${userId.userId}&page=${page}`)
      const data: OrdersResponse = await response.json()
      setOrders(data.data)
      setCurrentPage(data.currentPage)
      setTotalPages(data.totalPages)
      setTotalItems(data.totalItems)
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  useEffect(() => {
    fetchOrders(1)
  }, [])

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    fetchOrders(newPage)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="container mx-auto px-16 py-8">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {orders.map((order) => (
          <Card key={order._id} className="overflow-hidden flex flex-col">
            <CardHeader className="p-0">
              <div className="relative h-60 w-full">
                <Image
                  src={order.product.images[0]}
                  alt={order.product.title}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
              <CardTitle className="text-lg mb-2 line-clamp-2">{order.product.title}</CardTitle>
              <p className="text-sm text-muted-foreground mb-2">
                Ordered on: {formatDate(order.createdAt)}
              </p>
              <p className="font-semibold mb-2">
                Points Exchanged: {order.pointsExchanged}
              </p>
              <Badge variant={order.status === 'pending' ? 'secondary' : 'success'}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Order Details</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="max-h-[80vh]">
                    <OrderDetails order={order} />
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages} (Total Items: {totalItems})
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

function OrderDetails({ order }: { order: Order }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Image
          src={order.product.images[0]}
          alt={order.product.title}
          width={400}
          height={400}
          className="rounded-lg object-cover w-full h-auto"
        />
        <div className="grid grid-cols-4 gap-2 mt-2">
          {order.product.images.slice(1).map((image, index) => (
            <Image
              key={index}
              src={image}
              alt={`${order.product.title} - Image ${index + 2}`}
              width={100}
              height={100}
              className="rounded-lg object-cover w-full h-auto"
            />
          ))}
        </div>
      </div>
      <div>
        <Link href={`/product/${order.product._id}`}>
        <h2 className="text-2xl font-bold mb-4">{order.product.title}</h2>
        </Link>
        <p className="text-muted-foreground mb-4">{order.product.description}</p>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="font-semibold">Condition:</p>
            <p>{order.product.condition}</p>
          </div>
          <div>
            <p className="font-semibold">Type:</p>
            <p>{order.product.type}</p>
          </div>
          <div>
            <p className="font-semibold">Available Quantity:</p>
            <p>{order.product.availableQty}</p>
          </div>
          <div>
            <p className="font-semibold">Delivery Time:</p>
            <p>{order.product.deliveryTime} days</p>
          </div>
        </div>
        <div className="mb-4">
          <p className="font-semibold">Seller Information:</p>
          <p>{order.product.owner.Name}</p>
          <p>{order.product.owner.email}</p>
          <p>{order.product.owner.phone}</p>
        </div>
        <div className="mb-4">
          <p className="font-semibold">Order Status:</p>
          <Badge variant={order.status === 'pending' ? 'secondary' : 'success'}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </div>
        <div>
          <p className="font-semibold">Points Exchanged:</p>
          <p>{order.pointsExchanged}</p>
        </div>
      </div>
    </div>
  )
}