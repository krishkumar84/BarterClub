"use client"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, CheckCircle2, XCircle } from "lucide-react"
import { useEffect,useState } from "react"
import { set } from "mongoose"

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
  subscriptions: {
    _id: string;
    planType: string;
    duration: string;
    startDate: string;
    endDate: string;
    paymentStatus: string;
  }[];
  products: {
    _id: string;
    title: string;
    images: string[];
    description: string;
    price: number;
  }[];
}


const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(dateString))
}

export default function UserDetails({ user }: { user: User }) {
  const [points, setPoints] = useState("")
  const [getholdPayment, setgetholdPayment] = useState<{ data: string }>({ data: "" })

  const router = useRouter()
  console.log("now")
  console.log(user.subscription)

  const handleIncreasePoints = async () => {
    // Implement API call to increase points
    const clerkId = user.clerkId;
    const userId = user._id;

    const res = await fetch("/api/adminAddPoint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ userId, points,clerkId })
    })
    if (res.ok) {
      router.refresh();
      setPoints("")
    }
    const data = await res.json()
    console.log(data)
    console.log("Increasing points:", points)
    // After successful API call, refresh the page or update the user state
  }

  useEffect(() => {
    fetch("/api/esCrowPaymentByUser?userId=" + user._id)
      .then((res) => res.json())
      .then((data) => {
        setgetholdPayment({ data: data })
      })
  }, [])

  return (
    <div className="container mx-auto p-6">
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
              <p className="text-sm text-muted-foreground">ends on:  {new Date(user.subscription.endDate).toLocaleDateString('en-GB')}</p>
            </div>
            <div>
              <Label>Points Hold in BarterClub</Label>
              <p className="text-sm text-muted-foreground">points will be added after delivery of product and confirmation by buyer</p>
              <p>{getholdPayment.data} Points</p>
          </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{user.balance}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Discount Points</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{user.discountPoints}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Purchased Points</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{user.purchasedPoints}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Increase Points</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              type="number"
              placeholder="Enter points"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
            />
            <Button onClick={handleIncreasePoints}>Increase</Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="transactions" className="w-full">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {user.transactionHistory.map((transaction) => (
                    <TableRow key={transaction._id}>
                      <TableCell>{formatDate(transaction.date)}</TableCell>
                      <TableCell>{transaction.amount}</TableCell>
                      <TableCell>{transaction.transactionType}</TableCell>
                      <TableCell>{transaction.points}</TableCell>
                      <TableCell>{transaction.description || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="subscriptions">
          <Card>
            <CardHeader>
              <CardTitle>Subscription History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plan</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {user.subscriptions.map((subscription) => (
                    <TableRow key={subscription._id}>
                      <TableCell>{subscription.planType}</TableCell>
                      <TableCell>{subscription.duration}</TableCell>
                      <TableCell>{new Date(subscription.startDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(subscription.endDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                      {subscription.paymentStatus === "Paid" && new Date(subscription.endDate) > new Date() ? (
                          <CheckCircle2 className="text-green-500" />
                        ) : (
                          <XCircle className="text-red-500" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="products">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.products.map((product) => (
              <Card key={product._id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push(`/product/${product._id}`)}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    {product.title}
                    <ArrowUpRight className="h-4 w-4" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <img src={product.images[0]} alt={product.title} className="w-[80%] h-64 object-fill mb-4 rounded" />
                  <p className="text-sm text-muted-foreground mb-2">{product.description.substring(0, 100)}...</p>
                  <p className="font-bold">Price: {product.price} points</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}