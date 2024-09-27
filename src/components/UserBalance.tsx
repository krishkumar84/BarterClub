"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/nextjs';

const UserBalance = () => {
  const { userId, isSignedIn } = useAuth();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isSignedIn && userId) {
      axios.get(`/api/userBalance`)
        .then(response => {
          setBalance(response.data.balance);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching balance:', error);
          setLoading(false);
        });
    }
  }, [isSignedIn, userId]);

  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center">
      <div className="p-6 bg-white rounded-lg shadow-lg max-w-sm">
        <p className="text-center text-gray-800 font-semibold">
          Please sign in to view your balance.
        </p>
    </div>
    </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center">
      <div className="p-6 bg-white rounded-lg shadow-lg max-w-sm">
        <p className="text-center text-gray-500 font-semibold">
          Loading balance...
        </p>
      </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <div className="p-6 bg-gray-200 rounded-lg shadow-lg text-white max-w-sm">
        <h2 className="text-2xl text-gray-900 font-bold mb-2 text-center">Your Balance</h2>
        <p className="text-4xl font-extrabold text-black text-center">{balance} Barter Points</p>
      </div>
      </div>
  );
};

export default UserBalance;
