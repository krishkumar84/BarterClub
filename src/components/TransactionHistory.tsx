'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/nextjs';
import { formatDateTime } from '@/lib/utils';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function TransactionHistory() {
  const { userId, isSignedIn } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (isSignedIn && userId) {
      axios.get('/api/transactionHistory')
        .then(response => {
          setTransactions(response.data.transactions);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching transactions:', error);
          setLoading(false);
        });
    }
  }, [isSignedIn, userId]);

  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-800 font-semibold">Please sign in to view your transaction history.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 font-semibold">Loading transactions...</p>
      </div>
    );
  }

  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = transactions.slice(startIndex, endIndex);

  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-gray-700">No transactions found.</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction Details</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Info</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentTransactions.map((tx: any) => (
                      <tr key={tx.orderId} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <p className="text-sm font-medium text-gray-900">{tx.transactionType}</p>
                          <p className="text-xs text-gray-500">{formatDateTime(tx.date).dateTime}</p>
                          <p className="text-xs text-gray-500">Order ID: {tx.orderId}</p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm text-gray-900">{tx.description}</p>
                        </td>
                        <td className="px-4 py-4">
                          <Badge variant={tx.amount === "Purchase" ? "outline" : "secondary"} className="font-semibold">
                            {tx.amount}
                          </Badge>
                        </td>
                        <td className="px-4 py-4">
                          <Badge variant={tx.points > 0 ? "success" : "destructive"} className="font-semibold">
                            {tx.points} pts
                          </Badge>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm text-gray-900">{tx.razorpayPaymentId}</p>
                          <p className="text-xs text-gray-500">At: {formatDateTime(tx.createdAt).dateTime}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-700">
                  Showing {startIndex + 1} to {Math.min(endIndex, transactions.length)} of {transactions.length} transactions
                </p>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}