'use client'

import { useState } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckIcon, XIcon,Loader2 } from "lucide-react"
import { toast } from "sonner";
import { config } from '@/constants/index'

const apiUrl = config.apiUrl;

interface OrderActionsProps {
  orderId: string;
  initialStatus: string;
}

export default function OrderActions({ orderId, initialStatus }: OrderActionsProps) {
  const [status, setStatus] = useState(initialStatus)
  const [isLoading, setIsLoading] = useState(false)

  const handleOrderStatus = async (newStatus: 'approved' | 'rejected') => {
    // console.log("herre")
    console.log(orderId, newStatus)
    setIsLoading(true)
    try {
      await axios.post(`${apiUrl}/api/updateOrderStatus`, { orderId, status: newStatus })
      setStatus(newStatus)
      toast.success(`Order ${newStatus} successfully`)
    } catch (error) {
      console.error('Error updating order status:', error)
      toast.error('Error updating order status')
    }finally {
        setIsLoading(false)
      }
  }

  if (status === 'pending') {
    return (
      <div className="flex justify-center space-x-2">
        <Button
          size="sm"
          variant="outline"
          className="bg-green-500 hover:bg-green-600 text-white"
          onClick={() => handleOrderStatus('approved')}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CheckIcon className="h-4 w-4 mr-1" />
          )}
          <span className={isLoading ? 'sr-only' : ''}>Approve</span>
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="bg-red-500 hover:bg-red-600 text-white"
          onClick={() => handleOrderStatus('rejected')}
          disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <XIcon className="h-4 w-4 mr-1" />
            )}
            <span className={isLoading ? 'sr-only' : ''}>Reject</span>
        </Button>
      </div>
    )
  }

  return (
    <Badge variant={status === 'approved' ? 'success' : 'destructive'}>
      {status}
    </Badge>
  )
}