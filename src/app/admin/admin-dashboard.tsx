"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Users, FileText, ChevronDown, ChevronUp } from "lucide-react"

interface User {
  _id: string;
  Name: string;
  email: string;
  phone: string;
  balance: number;
}

interface Transaction {
  _id: string;
  userId: string;
  amount: string;
  transactionType: string;
  points: number;
  razorpayPaymentId: string;
  description: string;
  date: string;
  userDetails: {
    email: string;
    Name: string;
  };
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users")
  const [users, setUsers] = useState<User[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, transactionsResponse] = await Promise.all([
          axios.get("/api/getAllUsers"),
          axios.get("/api/getAllTransactions")
        ])
        setUsers(usersResponse.data.data)
        setTransactions(transactionsResponse.data.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleViewDetails = (userId: string) => {
    router.push(`/admin/users/${userId}`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
        </div>
        <nav className="mt-4">
          <Button
            variant={activeTab === "users" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("users")}
          >
            <Users className="mr-2 h-4 w-4" />
            Users
          </Button>
          <Button
            variant={activeTab === "transactions" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("transactions")}
          >
            <FileText className="mr-2 h-4 w-4" />
            Transactions
          </Button>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8 overflow-auto">
        <Card>
          <CardHeader>
            <CardTitle>{activeTab === "users" ? "Users" : "Transactions"}</CardTitle>
          </CardHeader>
          <CardContent>
            {activeTab === "users" && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{user.Name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>
                        <Badge variant={user.balance > 0 ? "success" : "destructive"}>
                          {user.balance.toFixed(2)} points
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" onClick={() => handleViewDetails(user._id)}>
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {activeTab === "transactions" && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction._id} className="hover:bg-gray-50">
                      <TableCell>
                        <div>{transaction.userDetails.Name}</div>
                        <div className="text-sm text-gray-500">{transaction.userDetails.email}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={transaction.transactionType === "Buy" ? "destructive" : "success"}>
                          {transaction.transactionType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {transaction.points > 0 ? (
                            <ChevronUp className="text-green-500 mr-1" />
                          ) : (
                            <ChevronDown className="text-red-500 mr-1" />
                          )}
                          <span className={transaction.points > 0 ? "text-green-500" : "text-red-500"}>
                            {Math.abs(transaction.points)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{transaction.razorpayPaymentId}</TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate" title={transaction.description}>
                          {transaction.description}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(transaction.date)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}