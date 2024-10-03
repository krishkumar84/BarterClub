import Search from '@/components/Search'
import { formatDateTime, formatPhoneNumber } from '@/lib/utils'
import { SearchParamProps } from '@/types'
import axios from 'axios'
import { config } from '@/constants/index'
import { Badge } from "@/components/ui/badge"

const apiUrl = config.apiUrl;

export default async function Orders({ searchParams }: SearchParamProps) {
  const postId = (searchParams?.postId as string) || ''
  const searchText = (searchParams?.query as string) || ''

  const orders = await axios.get(`${apiUrl}/api/getOrderByPost?postId=${postId}&searchString=${searchText}`);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Orders</h1>

      <div className="mb-6">
        <Search placeholder="Search buyer name..." />
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Details</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buyer Info</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buyer Address</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.data && orders.data.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-4 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.data?.data.map((row: any) => (
                <tr key={row._id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <p className="text-sm font-medium text-gray-900">{row._id}</p>
                    <p className="text-xs text-gray-500">{formatDateTime(row.createdAt).dateTime}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm font-medium text-gray-900">{row.buyer}</p>
                    <p className="text-xs text-gray-500">{row.buyerEmail}</p>
                    <p className="text-xs text-gray-500">{formatPhoneNumber(row.buyerPhone)}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-gray-900">{row.buyerAddress}</p>
                  </td>
                  <td className="px-4 py-4">
                    <a href={`/product/${row.productId}`} className="text-sm text-blue-600 hover:underline">
                      {row.productTitle}
                    </a>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Badge variant="secondary" className="font-semibold">
                      {row.pointsExchanged} pts
                    </Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}