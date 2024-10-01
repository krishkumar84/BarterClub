"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/nextjs';

const TransactionHistory = () => {
  const { userId, isSignedIn } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-black mb-4">Transaction History</h2>
        {transactions.length === 0 ? (
          <p className="text-gray-700">No transactions found.</p>
        ) : (
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-black text-white">
                <th className="py-2 px-4 text-left">Type</th>
                <th className="py-2 px-4 text-left">Amount</th>
                <th className="py-2 px-4 text-left">Date</th>
                <th className="py-2 px-4 text-left">Time</th>
                <th className="py-2 px-4 text-left">Points</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx: any) => (
                <tr key={tx._id} className="border-b border-gray-300">
                  <td className="py-2 px-4 text-black font-semibold">
                    {tx.transactionType}
                  </td>
                  <td className="py-2 px-4 text-black">{tx.amount}</td>
                  <td className="py-2 px-4 text-gray-600">
                    {new Date(tx.date).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 text-gray-600">
                    {new Date(tx.date).toLocaleTimeString()}
                  </td>
                  <td className={`py-2 px-4 font-bold ${
                    tx.points > 0 ? 'text-green-500' : 'text-black'
                  }`}>
                    {tx.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
