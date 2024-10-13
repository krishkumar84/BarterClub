import UserDetails from "./user-detail"
import { config } from '@/constants/index'

const apiUrl = config.apiUrl;

async function getUserDetails(userId: string) {
  const res = await fetch(`${apiUrl}/api/getUserDetails/${userId}`)
  const data = await res.json()
  return data.data
}

interface Params {
  userId: string;
}

export default async function UserDetailsPage({ params }: { params: Params }) {
  const user = await getUserDetails(params.userId)

  return <UserDetails user={user} />
}